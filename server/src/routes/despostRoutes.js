const express = require('express');
const router = express.Router();

const depostController = require('../controllers/depostController');

router.get('/customer', depostController.lookupCustomer);
router.get('/conditions', depostController.getConditions);
router.get('/rooms', depostController.getRooms);

// Deposit In
router.post('/preview', depostController.getDepositPreview);
router.post('/pay', depostController.payDeposit);

// Deposit Out
router.post('/calculate', depostController.calculateDepositOut);
router.post('/finalize', depostController.finalizeDepositOut);

module.exports = router;
