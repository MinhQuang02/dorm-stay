const express = require('express'); // THÊM DÒNG NÀY
const router = express.Router();    // THÊM DÒNG NÀY
const appointmentController = require('../controllers/appointmentController');

router.get('/appointments/pending', appointmentController.getPendingRequests);
router.get('/appointments/detail/:id', appointmentController.getRequestDetail);
router.post('/appointments/create', appointmentController.createAppointment);
router.post('/appointments/complete', appointmentController.completeAppointment);

module.exports = router; // THÊM DÒNG NÀY