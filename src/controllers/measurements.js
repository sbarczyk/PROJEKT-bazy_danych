// controllers/measurementController.js
const Measurement = require("../models/Measurement");

// Pobierz pomiar zalogowanego użytkownika
exports.getMy = async (req, res) => {
  const m = await Measurement.findOne({ user: req.user.id }); // Znajdź pomiar użytkownika
  return res.json({ success: true, data: m });
};

// Pobierz wszystkie pomiary - Tylko dla administratora
exports.getAll = async (req, res) => {
  const all = await Measurement.find().populate("user", "name email"); // Pobierz i dołącz dane użytkownika
  res.json({ success: true, count: all.length, data: all });
};

// Utwórz nowy pomiar - Zwykły użytkownik może tylko raz
exports.create = async (req, res) => {
  try {
    const exists = await Measurement.findOne({ user: req.user.id }); // Sprawdź, czy pomiar już istnieje
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Masz już pomiar. Użyj PATCH, żeby zaktualizować.",
      });
    }
    const m = await Measurement.create({ ...req.body, user: req.user.id }); // Utwórz nowy pomiar
    res.status(201).json({ success: true, data: m });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Zaktualizuj pomiar użytkownika - Tylko dla administratora
exports.updateByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Brak danych do aktualizacji.",
      });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.user;

    const m = await Measurement.findOne({ user: userId }); // Znajdź pomiar użytkownika
    if (!m) {
      return res.status(404).json({
        success: false,
        message: "Pomiar tego użytkownika nie istnieje.",
      });
    }

    Object.assign(m, updates); // Zaktualizuj pomiar
    await m.save();

    res.json({ success: true, data: m });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Usuń pomiar użytkownika - Tylko dla administratora
exports.deleteByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const m = await Measurement.findOneAndDelete({ user: userId }); // Usuń pomiar użytkownika
    if (!m) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Pomiar tego użytkownika nie istnieje.",
        });
    }
    res.json({ success: true, message: "Pomiar usunięty." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Zaktualizuj własny pomiar
exports.updateMy = async (req, res) => {
  try {
    const m = await Measurement.findOne({ user: req.user.id }); // Znajdź pomiar użytkownika
    if (!m)
      return res
        .status(404)
        .json({ success: false, message: "Nie masz pomiaru." });
    Object.assign(m, req.body); // Zaktualizuj pomiar
    await m.save();
    res.json({ success: true, data: m });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Usuń własny pomiar
exports.deleteMy = async (req, res) => {
  const result = await Measurement.findOneAndDelete({ user: req.user.id }); // Usuń pomiar użytkownika
  if (!result) {
    return res
      .status(404)
      .json({ success: false, message: "Nie masz pomiaru." });
  }
  res.json({ success: true, message: "Twój pomiar został usunięty." });
};
