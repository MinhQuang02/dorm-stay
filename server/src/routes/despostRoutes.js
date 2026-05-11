const express = require('express');
const router = express.Router();

const depostController = require('../controllers/depostController');

// SECTION 1 - CUSTOMER + PHIEU YEU CAU
router.get('/customer', depostController.lookupCustomer);

// SECTION 2 - DIEU KIEN LUU TRU
router.get('/conditions', depostController.getConditions);

// SECTION 3 - ROOMS
router.get('/rooms', depostController.getRooms);

// Deposit In
router.post('/preview', depostController.getDepositPreview);
router.post('/pay', depostController.payDeposit);

// Deposit Out
router.post('/calculate', depostController.calculateDepositOut);
router.post('/finalize', depostController.finalizeDepositOut);

module.exports = router;
