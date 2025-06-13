// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['strength_test', 'group_training', 'personal_training']
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // minuty
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual property - liczba dostępnych miejsc
eventSchema.virtual('availableSpots').get(function() {
  return this.maxParticipants - this.participants.length;
});

eventSchema.index(
  { _id: 1, 'participants.user': 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('Event', eventSchema);