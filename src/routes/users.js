const express   = require('express');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success:false, message:'Nieprawidłowe dane.' });
  }
  const payload = { id: user._id };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success:true, token });
});

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, isAdmin: false });
    res.status(201).json({
      success: true,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ success:false, message: err.message });
  }
});


router.post(
  '/',
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { name, email, password, isAdmin } = req.body;
      const user = await User.create({
        name,
        email,
        password,
        isAdmin: Boolean(isAdmin)
      });
      res.status(201).json({
        success: true,
        user: {
          _id:   user._id,
          name:  user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } catch (err) {
      res.status(400).json({ success:false, message: err.message });
    }
  }
);

// GET /api/users
// dostępne tylko adminów
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// PATCH /api/users/:id
// edycja name, email, password (zahashowane) przez właściciela lub admina
router.patch('/:id', protect, async (req, res) => {
  const { id } = req.params;

  // tylko admin lub właściciel konta
  if (!req.user.isAdmin && req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: 'Brak dostępu.'
    });
  }

  // zbieramy tylko pola do zmiany
  const updateData = {};
  if (req.body.name)     updateData.name     = req.body.name;
  if (req.body.email)    updateData.email    = req.body.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Nie znaleziono użytkownika.'
      });
    }

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});


// DELETE /api/users/:id
// — admin może usuwać wszystkich, zwykły user tylko siebie
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;

  // jeśli nie admin i to nie jego własne konto → brak dostępu
  if (!req.user.isAdmin && req.user.id !== id) {
    return res.status(403).json({ success:false, message:'Brak dostępu.' });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success:false, message:'Nie znaleziono użytkownika.' });
    }
    res.json({ success:true, message:'Użytkownik usunięty.' });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

module.exports = router;
