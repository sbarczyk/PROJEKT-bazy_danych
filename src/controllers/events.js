const Event = require('../models/Event');
const mongoose = require('mongoose');

// GET /api/events          – wszyscy widzą listę aktywnych; admin widzi wszystko
exports.getAllEvents = async (req, res) => {
  try {
    const filter = req.user?.isAdmin ? {} : { isActive: true };
    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Nie znaleziono eventu' });
    }
    // zwykły user nie może podejrzeć eventu nieaktywnego
    if (!event.isActive && !req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: 'Brak uprawnień' });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// controllers/events.js  (zamień tylko funkcję register)
exports.register = async (req, res) => {
  try {
    const now = new Date();

    // atomiczne zapytanie + update
    const ev = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true,
        date: { $gte: now },                     // event w przyszłości
        'participants.user': { $ne: req.user.id }, // user nie zapisany
        $expr: {                                 // jest wolne miejsce
          $lt: [{ $size: '$participants' }, '$maxParticipants' ]
        }
      },
      { $push: { participants: { user: req.user.id } } },
      { new: true } // zwróć zaktualizowany dokument
    );

    if (!ev) {
      return res.status(400).json({
        success: false,
        message:
          'Brak wolnych miejsc, event nieaktywny lub jesteś już zapisany.'
      });
    }

    res.json({ success: true, data: ev });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.unregister = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ success:false, message:'Nie znaleziono' });

    // zwykły user może wycofać się tylko sam, admin kogokolwiek
    if (!req.user.isAdmin) {
      ev.participants = ev.participants.filter(p => !p.user.equals(req.user.id));
    } else {
      const { userId } = req.body;           // admin może wskazać usera
      ev.participants = ev.participants.filter(p => !p.user.equals(userId));
    }

    await ev.save();
    res.json({ success:true, data: ev });
  } catch (err) {
    res.status(400).json({ success:false, message: err.message });
  }
};



exports.createEvent = async (req, res) => {
  try {
    const ev = await new Event(req.body).save();
    res.status(201).json({ success: true, data: ev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// PATCH /api/events/:id    – ADMIN
exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ev) {
      return res.status(404).json({ success: false, message: 'Nie znaleziono eventu' });
    }
    res.json({ success: true, data: ev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/events/:id   – ADMIN
exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) {
      return res.status(404).json({ success: false, message: 'Nie znaleziono eventu' });
    }
    res.json({ success: true, message: 'Usunięto event' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};