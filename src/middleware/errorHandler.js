// middleware/errorHandler.js

const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message || 'Wystąpił błąd serwera';

  // Błąd ID (np. niepoprawny ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Nieprawidłowy identyfikator: ${err.value}`;
  }

  // Błąd walidacji schematu Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
                    .map(e => e.message)
                    .join(', ');
  }

  // Duplikat klucza (np. unikalny email)
  if (err.code && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Pole "${field}" musi być unikalne.`;
  }

  // Niestandardowy AppError
  if (err.name === 'AppError') {
    statusCode = err.statusCode || 400;
    message    = err.message || 'Błąd aplikacji';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;