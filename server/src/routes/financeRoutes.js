const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.post('/deposit-out/calculate', financeController.calculateDepositOut);
router.post('/deposit-out/finalize', financeController.finalizeDepositOut);

module.exports = router;
