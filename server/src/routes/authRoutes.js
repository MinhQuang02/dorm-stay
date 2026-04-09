const express = require('express');
const { registerUser, loginUser, loginAdmin, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// User auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin auth routes
router.post('/admin/login', loginAdmin);

// Verify JWT / Get Profile
router.get('/me', authMiddleware, getMe);

module.exports = router;
