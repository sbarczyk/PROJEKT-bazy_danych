const express   = require('express');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');
const router    = express.Router();

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success:false, message:'Nieprawidłowe dane.' });
  }
  // payload tokena
  const payload = { id: user._id };
  // generowanie tokena (sekret w .env: JWT_SECRET)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success:true, token });
});

module.exports = router;

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // tworzymy usera – dzięki pre-save hook hashujemy hasło
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }});
  } catch (err) {
    return res.status(400).json({ success:false, message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const users = await User
      .find()
    //   .select('-password')               // nie wysyłaj haseł!
    //   .sort({ createdAt: -1 })           // np. od najnowszych
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})