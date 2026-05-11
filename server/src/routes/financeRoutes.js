const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController'); // ĐÃ SỬA: Import đúng financeController

// Deposit Out (Hoàn cọc)
router.post('/deposit-out/calculate', financeController.calculateDepositOut);
router.post('/deposit-out/finalize', financeController.finalizeDepositOut);

module.exports = router;