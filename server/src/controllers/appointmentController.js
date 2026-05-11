const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Lấy danh sách phiếu CHƯA XEM PHÒNG (Dùng cho Appointment.jsx)

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.phieuYeuCau.findMany({
      include: {
        taiKhoanMoiNhat: { include: { khachHang: true } },
        lichXemPhongs: {
          where: { ttLichHen: 'CHUA_XEM' }
        }
      },
      orderBy: { idPhieu: 'desc' }
    });

    const formatted = requests.map(p => {
      const activeSchedule = p.lichXemPhongs[0];
      return {
        idPhieu: p.idPhieu,
        customerName: p.taiKhoanMoiNhat?.khachHang?.hoTen || "N/A",
        phone: p.taiKhoanMoiNhat?.khachHang?.sdt || "N/A",
        // Ưu tiên hiện ngày Admin đã chốt, nếu chưa có thì hiện ngày khách đề xuất
        proposedDate: activeSchedule?.thoiGianHen || p.thoiDiemVao || "Flexible",
        // Chìa khóa: Nếu ĐÃ CÓ bản ghi trong LichXemPhong thì hasSchedule = true (Hiện EDIT + Tích xanh)
        hasSchedule: !!activeSchedule, 
        idLichHen: activeSchedule?.idLichHen || null
      };
    });
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: "Lỗi." }); }
};

// 2. Admin nhấn SAVE & SEND (Tạo hoặc cập nhật lịch hẹn)
exports.createAppointment = async (req, res) => {
  const { idPhieu, date, location } = req.body;
  try {
    // Tìm xem phiếu này đã có lịch hẹn chưa
    const existingSchedule = await prisma.lichXemPhong.findFirst({
      where: { idPhieu: parseInt(idPhieu), ttLichHen: 'CHUA_XEM' }
    });

    let appointment;
    if (existingSchedule) {
      // Nếu đã có (đang nhấn nút EDIT), thì cập nhật lại giờ/chỗ
      appointment = await prisma.lichXemPhong.update({
        where: { idLichHen: existingSchedule.idLichHen },
        data: { thoiGianHen: new Date(date), diaDiem: location }
      });
    } else {
      // Nếu chưa có (đang nhấn nút SCHEDULE), thì tạo mới
      appointment = await prisma.lichXemPhong.create({
        data: {
          idPhieu: parseInt(idPhieu),
          thoiGianHen: new Date(date),
          diaDiem: location,
          ttLichHen: 'CHUA_XEM'
        }
      });
    }

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: "Lỗi lưu lịch hẹn." });
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

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await prisma.lichXemPhong.create({
      data: {
        idPhieu: parseInt(req.body.idPhieu),
        thoiGianHen: new Date(req.body.date),
        diaDiem: req.body.location,
        ttLichHen: 'CHUA_XEM'
      }
    });
    res.status(201).json({ success: true, appointment });
  } catch (e) { res.status(500).json({ error: "Lỗi." }); }
};