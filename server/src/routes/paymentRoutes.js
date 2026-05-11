const express = require('express');
const router  = express.Router();
const {
  getMyContracts,
  getContractForPayment,
  processPayment,
} = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Lấy danh sách hợp đồng của user đang đăng nhập
router.get('/my-contracts', getMyContracts);

// Lấy chi tiết hợp đồng để hiển thị trang thanh toán
router.get('/contract/:idHopDong', getContractForPayment);

// Thực hiện thanh toán
router.post('/pay', processPayment);

module.exports = router;