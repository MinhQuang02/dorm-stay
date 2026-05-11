const { PrismaClient } = require('@prisma/client');
const mailService = require('../utils/mailService'); // Import service mail
const prisma = new PrismaClient();

// 1. Lấy danh sách phiếu CHƯA XEM PHÒNG (Dùng cho Appointment.jsx)

// 1. Lấy danh sách phiếu (Admin)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.phieuYeuCau.findMany({
      include: {
        taiKhoanMoiNhat: { 
          include: { khachHang: true } // Lấy thông tin khách hàng từ tài khoản
        },
        lichXemPhongs: { where: { ttLichHen: 'CHUA_XEM' } }
      },
      orderBy: { idPhieu: 'desc' }
    });

    const formatted = requests.map(p => {
      const activeSchedule = p.lichXemPhongs[0];
      // ƯU TIÊN LẤY EMAIL TỪ BẢNG KHACHHANG (Email khách nhập trong Form)
      const emailTuForm = p.taiKhoanMoiNhat?.khachHang?.email; 
      const emailTaiKhoan = p.taiKhoanMoiNhat?.email;

      return {
        idPhieu: p.idPhieu,
        customerName: p.taiKhoanMoiNhat?.khachHang?.hoTen || "N/A",
        email: emailTuForm || emailTaiKhoan || "N/A", // Ưu tiên email form
        phone: p.taiKhoanMoiNhat?.khachHang?.sdt || "N/A",
        proposedDate: activeSchedule?.thoiGianHen || p.thoiDiemVao || "Flexible",
        hasSchedule: !!activeSchedule,
        idLichHen: activeSchedule?.idLichHen || null
      };
    });
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: "Lỗi." }); }
};

// 2. Admin nhấn SAVE & SEND (Gửi mail chính xác)
exports.createAppointment = async (req, res) => {
  const { idPhieu, date, location } = req.body;
  const mailService = require('../utils/mailService');

  try {
    const phieu = await prisma.phieuYeuCau.findUnique({
      where: { idPhieu: parseInt(idPhieu) },
      include: {
        taiKhoanMoiNhat: {
          include: { 
            khachHang: true 
          }
        }
      }
    });

    
    const emailTuHoso = phieu.taiKhoanMoiNhat?.khachHang?.email;
    const emailTaiKhoan = phieu.taiKhoanMoiNhat?.email;
    
    // Ưu tiên email từ hồ sơ khách hàng trước
    const userEmail = emailTuHoso || emailTaiKhoan; 

    // Ghi log để bạn soi trong terminal
    console.log(">>> [TRUY VẾT] Mail trong hồ sơ (KhachHang):", emailTuHoso);
    console.log(">>> [TRUY VẾT] Mail tài khoản (TaiKhoan):", emailTaiKhoan);
    console.log(">>> [KẾT LUẬN] Sẽ gửi mail tới:", userEmail);

    const userName = phieu.taiKhoanMoiNhat?.khachHang?.hoTen || "Quý khách";
    const roomName = phieu.loaiPhong || "Phòng tại DormStay";

    // --- Logic lưu DB ---
    const existingSchedule = await prisma.lichXemPhong.findFirst({
      where: { idPhieu: parseInt(idPhieu), ttLichHen: 'CHUA_XEM' }
    });

    if (existingSchedule) {
      await prisma.lichXemPhong.update({
        where: { idLichHen: existingSchedule.idLichHen },
        data: { thoiGianHen: new Date(date), diaDiem: location }
      });
    } else {
      await prisma.lichXemPhong.create({
        data: { idPhieu: parseInt(idPhieu), thoiGianHen: new Date(date), diaDiem: location, ttLichHen: 'CHUA_XEM' }
      });
    }

    // --- Gửi mail ---
    if (userEmail) {
      const dateObj = new Date(date);
      mailService.sendAppointmentEmail(userEmail, userName, {
        date: dateObj.toLocaleDateString('vi-VN'),
        time: dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        location: location,
        roomName: roomName
      }).then(() => console.log(`>>> [XÁC NHẬN] Đã gửi thành công tới: ${userEmail}`))
        .catch(err => console.error("Lỗi gửi mail:", err));
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

// 2. Cập nhật trạng thái thành ĐÃ XEM (Hoàn tất)
exports.completeAppointment = async (req, res) => {
  const { idLichHen } = req.body;
  try {
    await prisma.lichXemPhong.update({
      where: { idLichHen: parseInt(idLichHen) },
      data: { 
        ttLichHen: 'DA_XEM',
        ttSauHen: 'CHUA_QUYET_DINH' // Trạng thái mặc định sau khi xem
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái." });
  }
};

// 3. Lấy chi tiết & 4. Tạo lịch hẹn (Giữ nguyên như cũ)
exports.getRequestDetail = async (req, res) => {
  try {
    const request = await prisma.phieuYeuCau.findUnique({
      where: { idPhieu: parseInt(req.params.id) },
      include: { taiKhoanMoiNhat: { include: { khachHang: true } } }
    });
    res.json(request);
  } catch (e) { res.status(500).json({ error: "Lỗi." }); }
};

