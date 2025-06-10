const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  // podobnie jak wyżej
};

exports.createEvent = async (req, res) => {
  // new Event(req.body).save()
};

exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const ev = await Event.findById(req.params.id).session(session);
    if (!ev) throw new Error('Brak eventu');
    if (ev.participants.length >= ev.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Brak wolnych miejsc' });
    }
    ev.participants.push({ user: req.user.id });
    await ev.save({ session });
    await session.commitTransaction();
    res.json({ success: true, data: ev });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
