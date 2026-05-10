const express = require("express");
const router = express.Router();
const contractRecordController = require("../controllers/contractRecordController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.get('/rooms', contractRecordController.getRooms);
router.get('/active', contractRecordController.getActiveContracts);
router.get('/customer', contractRecordController.findCustomer);
router.get('/:idHopDong', contractRecordController.getContractById);
router.post('/residence', authMiddleware, contractRecordController.recordResidence);

module.exports = router;