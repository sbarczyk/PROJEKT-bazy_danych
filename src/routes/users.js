const express   = require('express');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const { protect } = require('../middleware/auth');

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



function adminOnly(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success:false, message:'Brak dostępu. Tylko admin.' });
  }
  next();
}


router.post(
  '/',
  protect,      // musi być zalogowany
  adminOnly,    // i mieć flagę isAdmin === true
  async (req, res) => {
    try {
      const { name, email, password, isAdmin } = req.body;
      const user = await User.create({
        name,
        email,
        password,
        isAdmin: Boolean(isAdmin)  // jeśli admin chce, może ustawić true
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
      // .select('-password')
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
    );  // nigdy nie zwracaj hash’a

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

module.exports = router;
