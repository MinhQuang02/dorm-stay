const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // dùng SSL
  auth: {
    user: 'hvsinh23@clc.fitus.edu.vn', // Gmail của bạn
    pass: 'txcf lzsd cejf bbjb'        // Mã 16 ký tự viết liền không cách
  }
});

exports.sendAppointmentEmail = async (userEmail, userName, appointmentDetails) => {
  const { date, time, location, roomName } = appointmentDetails;

  const mailOptions = {
    from: '"DormStay Homestay" <hvsinh23@clc.fitus.edu.vn>',
    to: userEmail,
    subject: 'Xác nhận lịch hẹn xem phòng - DormStay',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #cc6b34;">Chào ${userName},</h2>
        <p>Chúng tôi đã xác nhận yêu cầu xem phòng của bạn tại <b>DormStay Homestay</b>.</p>
        <p>Dưới đây là thông tin lịch hẹn chính thức:</p>
        <div style="background: #faeddb; padding: 15px; border-radius: 10px;">
          <p>🏠 <b>Phòng:</b> ${roomName}</p>
          <p>📅 <b>Ngày xem:</b> ${date}</p>
          <p>⏰ <b>Giờ xem:</b> ${time}</p>
          <p>📍 <b>Địa điểm:</b> ${location}</p>
        </div>
        <p>Vui lòng đến đúng giờ. Nếu bạn có thay đổi gì, hãy liên hệ với chúng tôi qua số điện thoại hỗ trợ.</p>
        <p>Trân trọng,<br><b>Đội ngũ DormStay</b></p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};