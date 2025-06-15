// models/Workout.js
const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps:    { type: Number, required: true, min: 1 },
  weight:  { type: Number, required: true, min: 0 },
  restTime:{ type: Number, default: 0 }               // sekundy
});

const workoutExerciseSchema = new mongoose.Schema({
  exercise:{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets:    [setSchema],
  notes:   { type: String, trim: true }
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true, trim: true },

  date: { type: Date, required: true, default: Date.now },

  /* ----------  WALIDACJA ĆWICZEŃ  ---------- */
  exercises: {
    type: [workoutExerciseSchema],
    validate: [
      
      {
        validator: arr => Array.isArray(arr) && arr.length > 0,
        message  : 'Workout musi zawierać co najmniej jedno ćwiczenie.'
      },
      
      {
        async validator(arr) {
          const ids       = arr.map(e => e.exercise.toString());
          const uniqueIds = [...new Set(ids)];                      
          const count     = await mongoose
                               .model('Exercise')
                               .countDocuments({ _id: { $in: uniqueIds } });

          return count === uniqueIds.length;                      
        },
        message: 'Co najmniej jedno ćwiczenie nie istnieje w bazie.'
      }
    ]
  },

  duration: { type: Number, min: 0 },              // minuty
  notes:    { type: String, trim: true },

  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);
