const express = require('express');
const router = express.Router();
const multer = require('multer');
const interactionController = require('../controllers/interactionController');

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/complaint', upload.single('evidence'), interactionController.sendComplaint);
router.post('/verify-email', interactionController.verifyEmail);

module.exports = router;
