const express = require("express");
const router = express.Router();
const contractRecordController = require("../controllers/contractRecordController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.get('/rooms', contractRecordController.getRooms);
router.get('/active', contractRecordController.getActiveContracts);
router.get('/customer', contractRecordController.findCustomer);
router.post('/residence', authMiddleware, contractRecordController.recordResidence);
router.get('/:idHopDong', contractRecordController.getContractById);

module.exports = router;