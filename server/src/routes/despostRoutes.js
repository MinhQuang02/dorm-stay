const express = require('express');
const router = express.Router();
const depostController = require('../controllers/depostController');

// Tra cứu thông tin khách hàng (Thêm dòng này nè)
router.get('/customer', depostController.lookupCustomer);

// Deposit Out
router.post('/calculate', depostController.calculateDepositOut);
router.post('/finalize', depostController.finalizeDepositOut);

module.exports = router;

