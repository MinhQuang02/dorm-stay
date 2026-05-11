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

    await prisma.phieuYeuCau.update({
      where: { idPhieu: parseInt(phieuId) },
      data: {
        loaiPhong: room.name,
        khuVucMongMuon: room.address,
        thoiDiemVao: new Date(bookingDetails.date) // Lưu vào "Ngày đề xuất"
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchRooms = async (req, res) => {
  try {
    const { roomType, people, maxPrice } = req.query;

    const rooms = await prisma.phong.findMany({
      where: {
        trangThai: 'TRONG',
        loaiPhong: roomType && roomType !== 'Room Type' ? { contains: roomType } : undefined,
        sucChua: people ? { gte: parseInt(people) } : undefined,
        giuongs: {
          some: {
            trangThai: true,
            giaGiuong: maxPrice && maxPrice !== 'Price' ? { lte: parseFloat(maxPrice) } : undefined
          }
        }
      },
      include: {
        giuongs: { where: { trangThai: true }, orderBy: { giaGiuong: 'asc' } },
        // LẤY TÀI SẢN: Truy vấn qua bảng trung gian QuanLyTaiSan để lấy tên tài sản
        quanLyTaiSans: {
          include: {
            taiSan: true 
          }
        }
      }
    });

    const formattedRooms = rooms.map(p => ({
      id: p.idPhong,
      name: p.loaiPhong,
      address: "District 5, Ho Chi Minh City",
      price: p.giuongs.length > 0 ? (p.giuongs[0].giaGiuong).toLocaleString('vi-VN') + " đ" : "N/A",
      img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      people: `1-${p.sucChua} people`,
      // Gộp danh sách tên tài sản thành một mảng strings
      amenities: p.quanLyTaiSans.map(q => q.taiSan.tenTaiSan) 
    }));

    return res.json(formattedRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
