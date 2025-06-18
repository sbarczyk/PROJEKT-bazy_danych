require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Modele
require('./models/User');

// Middleware
const { protect } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Inicjalizacja aplikacji
const app = express();

// Middleware globalne
app.use(cors());
app.use(express.json());

// Pokazanie URI bazy w konsoli
console.log('Loaded URI:', process.env.MONGO_URI);

// Rejestracja tras
app.use('/api/exercises',     require('./routes/exercises'));
app.use('/api/workouts',      protect, require('./routes/workouts'));
app.use('/api/measurements',  require('./routes/measurements'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/reports',       require('./routes/reports'));

// Testowy endpoint
app.get('/', (req, res) => {
  res.send('GymTracker API działa 🚀');
});

// Handler błędów
app.use(errorHandler);

// Połączenie z MongoDB i start serwera
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Połączono z MongoDB');
    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Błąd połączenia z MongoDB:', err);
  });