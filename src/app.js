require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routów (jeszcze puste pliki)
const exerciseRoutes = require('./routes/exercises');
// ...

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Podstawowe routy
app.use('/api/exercises', exerciseRoutes);
// ...

// Testowy endpoint
app.get('/', (req, res) => {
  res.send('GymTracker API działa 🚀');
});

// Połączenie z MongoDB i start serwera
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Połączono z MongoDB');
  app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
})
.catch(err => {
  console.error('Błąd połączenia z MongoDB:', err);
});
