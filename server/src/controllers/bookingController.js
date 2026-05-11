const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Xử lý Form đăng ký thông tin cá nhân (RegistrationForm.jsx)
// Trong server/src/controllers/bookingController.js
exports.submitRegistration = async (req, res) => {
  try {
    // 1. Kiểm tra xem req.body có tồn tại không
    if (!req.body) {
      return res.status(400).json({ error: "Dữ liệu gửi lên bị trống (Empty Body)" });
    }

    const { hoTen, sdt, email, cccd, hinhThucThue, soNguoi } = req.body;

    // 2. Kiểm tra riêng field cccd
    if (!cccd) {
      return res.status(400).json({ error: "Thiếu trường dữ liệu 'cccd'. Vui lòng kiểm tra lại Frontend." });
    }

    const idTaiKhoanToken = 464;

    const result = await prisma.$transaction(async (tx) => {
      // Dùng idTaiKhoan để upsert như mình đã hướng dẫn ở bước trước
      const customer = await tx.khachHang.upsert({
        where: { idTaiKhoan: idTaiKhoanToken },
        update: { hoTen, sdt, email, cccd },
        create: { hoTen, sdt, email, cccd, idTaiKhoan: idTaiKhoanToken }
      });

      const phieu = await tx.phieuYeuCau.create({
        data: {
          hinhThucThue: hinhThucThue || 'O_GHEP',
          soNguoi: parseInt(soNguoi) || 1,
          loaiPhong: "Đang chọn...",
          khuVucMongMuon: "Đang chọn..."
        }
      });

      await tx.taiKhoan.update({
        where: { idTaiKhoan: idTaiKhoanToken },
        data: { phieuMoiNhatId: phieu.idPhieu }
      });

      return { customer, phieu };
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Lỗi tại submitRegistration:", error);
    return res.status(500).json({ error: error.message });
  }
};


// 2. Tìm kiếm phòng dựa trên tiêu chí (FindRooms.jsx)
exports.searchRooms = async (req, res) => {
  try {
    const { area, roomType, minPrice, maxPrice } = req.query;

    const rooms = await prisma.phong.findMany({
      where: {
        trangThai: 'TRONG', // Chỉ lấy phòng còn trống
        loaiPhong: roomType ? { contains: roomType } : undefined,
      },
      include: {
        giuongs: {
          where: { trangThai: true } // Chỉ lấy các giường chưa có người ở
        }
      }
    });

    // Format lại để phù hợp với Array "rooms" ở Frontend của bạn
    const formattedRooms = rooms.map(p => ({
      id: p.idPhong,
      name: p.loaiPhong,
      address: "District 5, Ho Chi Minh City", // Data mẫu hoặc lấy từ DB nếu có
      price: p.giuongs.length > 0 ? (p.giuongs[0].giaGiuong).toLocaleString('vi-VN') + " đ" : "Contact",
      img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      people: `1-${p.sucChua} people`
    }));

    return res.json(formattedRooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to search rooms." });
  }
};

// 3. Xác nhận đặt lịch hẹn xem phòng (RegisterBooking.jsx)
exports.finalizeBooking = async (req, res) => {
  try {
    const { phieuId, room, bookingDetails } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Cập nhật Phiếu yêu cầu với tên phòng và địa chỉ thực tế
      const phieu = await tx.phieuYeuCau.update({
        where: { idPhieu: parseInt(phieuId) },
        data: {
          loaiPhong: room.name,        // Ví dụ: "Phòng Master tầng 3"
          khuVucMongMuon: room.address // Ví dụ: "District 5, Ho Chi Minh City"
        }
      });

      // 2. Tạo Lịch xem phòng
      const lich = await tx.lichXemPhong.create({
        data: {
          idPhieu: phieu.idPhieu,
          thoiGianHen: new Date(bookingDetails.date),
          diaDiem: "Tại: " + room.name,
          ttLichHen: 'CHUA_XEM'
        }
      });

      return { phieu, lich };
    });

    // Trả về success: true để Frontend biết mà chuyển trang
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};