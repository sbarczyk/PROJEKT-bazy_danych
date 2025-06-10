const Measurement = require('../models/Measurement');

exports.getAllMeasurements = async (req, res) => {
  try {
    const data = await Measurement.find({ user: req.user?.id }).sort({ date: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMeasurementById = async (req, res) => {
  try {
    const m = await Measurement.findById(req.params.id);
    if (!m) return res.status(404).json({ success: false, message: 'Nie znaleziono pomiaru' });
    res.json({ success: true, data: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMeasurement = async (req, res) => {
  try {
    const m = new Measurement({ ...req.body, user: req.user?.id });
    const saved = await m.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateMeasurement = async (req, res) => {
  try {
    const updated = await Measurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Nie znaleziono pomiaru' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMeasurement = async (req, res) => {
  try {
    const del = await Measurement.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, message: 'Nie znaleziono pomiaru' });
    res.json({ success: true, message: 'Usunięto pomiar' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
