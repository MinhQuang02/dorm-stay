const express = require('express');
const router = express.Router();
const depostController = require('../controllers/depostController');
const contractController = require('../controllers/contractController');

// Deposit Out
router.post('/deposit-out/calculate', depostController.calculateDepositOut);
router.post('/deposit-out/finalize', depostController.finalizeDepositOut);

// Contract Fees Payment
router.post('/contracts', contractController.getUserContracts);
router.post('/contracts/pay', contractController.payContract);

module.exports = router;
