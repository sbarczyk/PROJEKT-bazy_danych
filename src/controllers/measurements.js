// controllers/measurementController.js
const Measurement = require('../models/Measurement');

// GET /api/measurements
// zwraca pomiar zalogowanego usera
exports.getMy = async (req, res) => {
  const m = await Measurement.findOne({ user: req.user.id });
  return res.json({ success: true, data: m });
};

// GET /api/measurements/all
// adminOnly: wszystkie pomiary
exports.getAll = async (req, res) => {
  const all = await Measurement.find().populate('user', 'name email');
  res.json({ success: true, count: all.length, data: all });
};

// POST /api/measurements
// zwykły user tylko raz
exports.create = async (req, res) => {
  try {
    const exists = await Measurement.findOne({ user: req.user.id });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Masz już pomiar. Użyj PATCH, żeby zaktualizować.'
      });
    }
    const m = await Measurement.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: m });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/measurements/:userId   ← admin modyfikuje po userId
exports.updateByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Brak danych do aktualizacji.'
      });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.user;

    const m = await Measurement.findOne({ user: userId });
    if (!m) {
      return res.status(404).json({
        success: false,
        message: 'Pomiar tego użytkownika nie istnieje.'
      });
    }

    Object.assign(m, updates);
    await m.save();

    res.json({ success: true, data: m });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/measurements/:userId   ← admin usuwa pomiar po userId
exports.deleteByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const m = await Measurement.findOneAndDelete({ user: userId });
    if (!m) {
      return res.status(404).json({ success:false, message:'Pomiar tego użytkownika nie istnieje.' });
    }
    res.json({ success:true, message:'Pomiar usunięty.' });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};


// PATCH /api/measurements  (bez :id)
exports.updateMy = async (req, res) => {
  try {
    const m = await Measurement.findOne({ user: req.user.id });
    if (!m) return res.status(404).json({ success:false, message:'Nie masz pomiaru.' });
    Object.assign(m, req.body);
    await m.save();
    res.json({ success:true, data: m });
  } catch (err) {
    res.status(400).json({ success:false, message: err.message });
  }
};

// DELETE /api/measurements
exports.deleteMy = async (req, res) => {
  const result = await Measurement.findOneAndDelete({ user: req.user.id });
  if (!result) {
    return res.status(404).json({ success:false, message:'Nie masz pomiaru.' });
  }
  res.json({ success:true, message:'Twój pomiar został usunięty.' });
};