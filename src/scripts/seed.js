// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');

const sampleExercises = [
  {
    name: 'Martwy ciąg',
    category: 'back',
    muscleGroups: ['back', 'glutes', 'hamstrings'],
    description: 'Podstawowe ćwiczenie siłowe angażujące wiele grup mięśniowych',
    instructions: [
      'Stań przed sztangą z nogami na szerokość bioder',
      'Pochyl się i chwyć sztangę nachwytem',
      'Unieś sztangę prostując nogi i tułów jednocześnie',
      'Wróć do pozycji wyjściowej kontrolowanym ruchem'
    ],
    isPublic: true
  },
  {
    name: 'Wyciskanie na ławce płaskiej',
    category: 'chest',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Klasyczne ćwiczenie na klatkę piersiową',
    instructions: [
      'Połóż się na ławce, stopy na podłodze',
      'Chwyć sztangę nieco szerzej niż szerokość barków',
      'Opuść sztangę kontrolowanie do klatki',
      'Wyciśnij sztangę w górę do pełnego wyprostu rąk'
    ],
    isPublic: true
  },
  {
    name: 'Przysiad ze sztangą',
    category: 'legs',
    muscleGroups: ['quadriceps', 'glutes', 'calves'],
    description: 'Król ćwiczeń na dolną część ciała',
    instructions: [
      'Umieść sztangę na górnej części pleców',
      'Stań z nogami na szerokość bioder',
      'Zgiń kolana i biodra, schodząc w dół',
      'Wróć do pozycji stojącej'
    ],
    isPublic: true
  },
  {
    name: 'Podciąganie na drążku',
    category: 'back',
    muscleGroups: ['back', 'biceps'],
    description: 'Ćwiczenie z własną masą ciała na plecy',
    instructions: [
      'Chwyć drążek nachwytem szerzej niż szerokość barków',
      'Zwiś na drążku z prostymi ramionami',
      'Podciągnij się w górę aż broda znajdzie się nad drążkiem',
      'Opuść się kontrolowanie do pozycji wyjściowej'
    ],
    isPublic: true
  },
  {
    name: 'Wyciskanie nad głowę',
    category: 'shoulders',
    muscleGroups: ['shoulders', 'triceps'],
    description: 'Ćwiczenie na barki i tricepsy',
    instructions: [
      'Stań prosto z hantlami w rękach na wysokości barków',
      'Wyciśnij hantle nad głowę',
      'Opuść kontrolowanie do pozycji wyjściowej'
    ],
    isPublic: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Połączono z bazą danych');

    // Wyczyść istniejące ćwiczenia
    await Exercise.deleteMany({});
    console.log('Usunięto stare dane');

    // Dodaj nowe ćwiczenia
    await Exercise.insertMany(sampleExercises);
    console.log(`Dodano ${sampleExercises.length} przykładowych ćwiczeń`);

    console.log('Seeding zakończony pomyślnie!');
    process.exit(0);
  } catch (error) {
    console.error('Błąd podczas seedingu:', error);
    process.exit(1);
  }
};

seedDatabase();