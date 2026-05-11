const express = require('express');
const router  = express.Router();
const {
  getHandoverContracts,
  getAssetsByRoom,
  createHandoverRecord,
  getHandoverByContract,
} = require('../controllers/handoverController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Danh sách hợp đồng đã ghi nhận cư trú
router.get('/contracts',          getHandoverContracts);

// Tài sản theo phòng
router.get('/assets/:idPhong',    getAssetsByRoom);

// Biên bản bàn giao theo hợp đồng
router.get('/record/:idHopDong',  getHandoverByContract);

// Tạo biên bản bàn giao
router.post('/',                  createHandoverRecord);

module.exports = router;
