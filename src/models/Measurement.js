// models/Measurement.js
const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    min: 0
  },
  bodyFat: {
    type: Number,
    min: 0,
    max: 100
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    bicepLeft: Number,
    bicepRight: Number,
    thighLeft: Number,
    thighRight: Number,
    neck: Number
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

module.exports = mongoose.model('Measurement', measurementSchema);