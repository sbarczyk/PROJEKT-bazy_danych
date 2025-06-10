// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

router.get('/',       userCtrl.getAllUsers);
router.get('/:id',    userCtrl.getUserById);
router.post('/',      userCtrl.createUser);
router.put('/:id',    userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
