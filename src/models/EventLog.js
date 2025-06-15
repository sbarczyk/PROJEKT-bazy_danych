// models/EventLog.js
const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  action:{ type: String, enum:['REGISTER','UNREGISTER'], required: true },
  pts:   { type: Number, default: 0 },
  at:    { type: Date,   default: Date.now }
});
module.exports = mongoose.model('EventLog', logSchema);
