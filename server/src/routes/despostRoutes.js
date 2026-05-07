const express = require('express');
const router = express.Router();
const depostController = require('../controllers/depostController');

// Deposit Out
router.post('/calculate', depostController.calculateDepositOut);
router.post('/finalize', depostController.finalizeDepositOut);

module.exports = router;