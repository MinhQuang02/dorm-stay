const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. Route gửi thông tin đăng ký cá nhân (từ RegistrationForm.jsx)
// URL: POST /api/booking/register
router.post('/register', bookingController.submitRegistration);

// 2. Route tìm kiếm phòng trống theo tiêu chí (từ FindRooms.jsx)
// URL: GET /api/booking/search-rooms
router.get('/search-rooms', bookingController.searchRooms);

// 3. Route xác nhận đặt lịch hẹn xem phòng (từ RegisterBooking.jsx)
// URL: POST /api/booking/finalize
router.post('/finalize', bookingController.finalizeBooking);

// 4. Cập nhật thông tin thuê (Deposit update)
// URL: POST /api/booking/update-booking
router.post('/update-booking', bookingController.updateBookingInfo);


module.exports = router;