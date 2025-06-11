require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


require('./models/User');
// Import routów
const exerciseRoutes    = require('./routes/exercises');
const workoutRoutes     = require('./routes/workouts');
const measurementRoutes = require('./routes/measurements');
const eventRoutes       = require('./routes/events');
const userRoutes = require('./routes/users');
const { protect } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Podstawowe routy
app.use('/api/exercises',   exerciseRoutes);
app.use('/api/workouts', protect, workoutRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/events',       eventRoutes);
app.use('/api/users', userRoutes);

// Testowy endpoint
app.get('/', (req, res) => {
  res.send('GymTracker API działa 🚀');
});

// Połączenie z MongoDB i start serwera
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Połączono z MongoDB');
  app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
})
.catch(err => {
  console.error('Błąd połączenia z MongoDB:', err);
});
