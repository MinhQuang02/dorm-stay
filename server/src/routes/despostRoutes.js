

const express = require('express');
const router = express.Router();

const depostController = require('../controllers/depostController');

// SECTION 1 - CUSTOMER + PHIEU YEU CAU
router.get('/customer', depostController.lookupCustomer);

// SECTION 2 - DIEU KIEN LUU TRU
router.get('/conditions', depostController.getConditions);

// SECTION 3 - ROOMS
router.get('/rooms', depostController.getRooms);

module.exports = router;

