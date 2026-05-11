const express = require('express');
const router = express.Router();

const depostController = require('../controllers/depostController');

router.get('/customer', depostController.lookupCustomer);
router.get('/conditions', depostController.getConditions);
router.get('/rooms', depostController.getRooms);
module.exports = router;

// Deposit Out
router.post('/calculate', depostController.calculateDepositOut);
router.post('/finalize', depostController.finalizeDepositOut);

module.exports = router;
