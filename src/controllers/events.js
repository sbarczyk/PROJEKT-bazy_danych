const Event = require("../models/Event");
const mongoose = require("mongoose");
const User = require("../models/User");
const EventLog = require("../models/EventLog");

// Pobierz wszystkie wydarzenia - Administratorzy widzą wszystko, inni tylko aktywne
exports.getAllEvents = async (req, res) => {
  try {
    const filter = req.user?.isAdmin ? {} : { isActive: true }; // Filtruj na podstawie roli użytkownika
    const events = await Event.find(filter).sort({ date: 1 }); // Pobierz i posortuj wydarzenia według daty
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Pobierz wydarzenie po ID - Tylko aktywne wydarzenia są widoczne dla nie-adminów
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); // Znajdź wydarzenie po ID
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono eventu" }); // Wydarzenie nie znalezione
    }
    if (!event.isActive && !req.user?.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Brak uprawnień" }); // Odmowa dostępu do nieaktywnych wydarzeń
    }
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Zarejestruj się na wydarzenie - Operacja transakcyjna
exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Sprawdź, czy użytkownik może się zarejestrować: wydarzenie jest aktywne, w przyszłości i ma miejsce
    const now = new Date();
    const ev = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true,
        date: { $gte: now },
        "participants.user": { $ne: req.user.id },
        $expr: { $lt: [{ $size: "$participants" }, "$maxParticipants"] },
      },
      { $push: { participants: { user: req.user.id } } },
      { new: true, session }
    );
    if (!ev) throw new Error("Brak wolnych miejsc lub jesteś już zapisany.");

    // Zwiększ punkty użytkownika
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points: 10 } },
      { new: true, session }
    );

    // Zaloguj akcję rejestracji
    await EventLog.create(
      [
        {
          user: req.user.id,
          event: ev._id,
          action: "REGISTER",
          pts: 10,
        },
      ],
      { session }
    );

    await session.commitTransaction(); // Zatwierdź transakcję
    res.json({ success: true, data: { event: ev, points: user.points } });
  } catch (err) {
    await session.abortTransaction(); // Wycofaj transakcję w przypadku błędu
    res.status(409).json({ success: false, message: err.message });
  } finally {
    session.endSession(); // Zakończ sesję
  }
};

// Wyrejestruj się z wydarzenia - Operacja transakcyjna
exports.unregister = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Usuń użytkownika z uczestników wydarzenia
    const ev = await Event.findOneAndUpdate(
      { _id: req.params.id, "participants.user": req.user.id },
      { $pull: { participants: { user: req.user.id } } },
      { new: true, session }
    );
    if (!ev) throw new Error("Nie byłeś zapisany na ten event.");

    // Zmniejsz punkty użytkownika
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points: -10 } },
      { session }
    );

    // Zaloguj akcję wyrejestrowania
    await EventLog.create(
      [
        {
          user: req.user.id,
          event: ev._id,
          action: "UNREGISTER",
          pts: -10,
        },
      ],
      { session }
    );

    await session.commitTransaction(); // Zatwierdź transakcję
    res.json({ success: true, data: ev });
  } catch (err) {
    await session.abortTransaction(); // Wycofaj transakcję w przypadku błędu
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession(); // Zakończ sesję
  }
};

// Utwórz nowe wydarzenie
exports.createEvent = async (req, res) => {
  try {
    const ev = await new Event(req.body).save(); // Zapisz nowe wydarzenie
    res.status(201).json({ success: true, data: ev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Zaktualizuj istniejące wydarzenie - Tylko dla administratora
exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Aktualizuj z walidacją
    );
    if (!ev) {
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono eventu" }); // Wydarzenie nie znalezione
    }
    res.json({ success: true, data: ev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Usuń wydarzenie - Tylko dla administratora
exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id); // Usuń wydarzenie po ID
    if (!ev) {
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono eventu" }); // Wydarzenie nie znalezione
    }
    res.json({ success: true, message: "Usunięto event" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};
