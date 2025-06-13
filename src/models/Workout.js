// models/Workout.js
const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  restTime: {
    type: Number, // sekundy
    default: 0
  }
});

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [setSchema],
  notes: {
    type: String,
    trim: true
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  exercises: {
  type: [workoutExerciseSchema],

  // ⬇️  DWA walidatory: 1) lista nie może być pusta  2) każde ćwiczenie musi być w bazie
  validate: [
    // 1️⃣ co najmniej jedno ćwiczenie
    {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'Workout musi zawierać co najmniej jedno ćwiczenie.'
    },
    // 2️⃣ wszystkie ID-ki istnieją w kolekcji Exercise
    {
      // async → zwraca Promise; Mongoose obsłuży to sam
      validator: async function (arr) {
        const ids   = arr.map(e => e.exercise);
        const count = await mongoose
          .model('Exercise')              // unikamy cyklicznego importu
          .countDocuments({ _id: { $in: ids } });

        return count === ids.length;      // true ↔ wszystkie znalezione
      },
      message: 'Co najmniej jedno ćwiczenie nie istnieje w bazie.'
    }
  ]
},
  duration: {
    type: Number, // minuty
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema);