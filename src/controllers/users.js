const User = require("../models/User");

// Pobierz wszystkich użytkowników
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(); // Pobierz wszystkich użytkowników
    res.json(users);
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Pobierz użytkownika po ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id); // Znajdź użytkownika po ID
    if (!user) return res.status(404).json({ message: "User not found" }); // Użytkownik nie znaleziony
    res.json(user);
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Utwórz nowego użytkownika
exports.createUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body); // Utwórz nowego użytkownika
    const saved = await newUser.save(); // Zapisz użytkownika
    res.status(201).json(saved);
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Zaktualizuj użytkownika
exports.updateUser = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // Zaktualizuj użytkownika
    if (!updated) return res.status(404).json({ message: "User not found" }); // Użytkownik nie znaleziony
    res.json(updated);
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Usuń użytkownika
exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id); // Usuń użytkownika
    if (!deleted) return res.status(404).json({ message: "User not found" }); // Użytkownik nie znaleziony
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};
