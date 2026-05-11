const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Lấy danh sách phiếu CHƯA XEM PHÒNG (Dùng cho Appointment.jsx)
// 1. Lấy danh sách phiếu CHƯA XEM PHÒNG (Dùng cho Appointment.jsx)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.phieuYeuCau.findMany({
      where: {
        OR: [
          { lichXemPhongs: { none: {} } }, 
          { lichXemPhongs: { some: { ttLichHen: 'CHUA_XEM' } } }
        ]
      },
      include: {
        taiKhoanMoiNhat: { include: { khachHang: true } },
        lichXemPhongs: {
          where: { ttLichHen: 'CHUA_XEM' },
          orderBy: { thoiGianHen: 'asc' } // Lấy lịch hẹn gần nhất
        }
      },
      orderBy: { idPhieu: 'desc' }
    });

    const formatted = requests.map(p => {
      const activeSchedule = p.lichXemPhongs[0];
      return {
        idPhieu: p.idPhieu,
        idLichHen: activeSchedule?.idLichHen || null,
        customerName: p.taiKhoanMoiNhat?.khachHang?.hoTen || "N/A",
        phone: p.taiKhoanMoiNhat?.khachHang?.sdt || "N/A",
        
        proposedDate: activeSchedule?.thoiGianHen || p.thoiDiemVao || "Flexible",
        
        hasSchedule: !!activeSchedule
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Lỗi Server." });
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