const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const contractController = require('../controllers/contractController');

// Deposit Out
router.post('/deposit-out/calculate', financeController.calculateDepositOut);
router.post('/deposit-out/finalize', financeController.finalizeDepositOut);

// Contract Fees Payment
router.post('/contracts', contractController.getUserContracts);
router.post('/contracts/pay', contractController.payContract);

module.exports = router;
