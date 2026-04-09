const prisma = require('../models/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }

    // Check if user exists
    const existingUser = await prisma.taiKhoan.findFirst({
      where: {
        OR: [
          { email: email },
          { taiKhoan: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.taiKhoan.create({
      data: {
        taiKhoan: username,
        email: email,
        matKhau: hashedPassword
      }
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Check user
    const user = await prisma.taiKhoan.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.matKhau);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const payload = {
      id: user.idTaiKhoan,
      username: user.taiKhoan,
      email: user.email,
      role: 'user'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      message: 'Login successful.', 
      token, 
      user: { username: user.taiKhoan, email: user.email, role: 'user' } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dormstay.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const payload = {
        id: 'admin-1',
        username: 'Administrator',
        email: email,
        role: 'admin'
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
      
      return res.status(200).json({ 
        message: 'Admin login successful.', 
        token, 
        user: { username: payload.username, email: payload.email, role: 'admin' } 
      });
    }

    res.status(401).json({ message: 'Invalid admin credentials.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getMe
};
