const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Xử lý Form đăng ký thông tin cá nhân (RegistrationForm.jsx)
exports.submitRegistration = async (req, res) => {
  try {
    const { hoTen, sdt, email, cccd, hinhThucThue, soNguoi } = req.body;
    const idTaiKhoanToken = 464; // ID test của bạn

    const result = await prisma.$transaction(async (tx) => {
      // 1. SỬA TẠI ĐÂY: Upsert dựa trên idTaiKhoan để tránh lỗi Unique constraint
      const customer = await tx.khachHang.upsert({
        where: { 
          idTaiKhoan: idTaiKhoanToken 
        },
        update: { 
          hoTen, 
          sdt, 
          email, 
          cccd 
        },
        create: { 
          hoTen, 
          sdt, 
          email, 
          cccd, 
          idTaiKhoan: idTaiKhoanToken 
        }
      });

      // 2. Tạo Phiếu yêu cầu mới cho mỗi lần đăng ký
      const phieu = await tx.phieuYeuCau.create({
        data: {
          hinhThucThue: hinhThucThue || 'O_GHEP',
          soNguoi: parseInt(soNguoi) || 1,
          loaiPhong: "Đang chọn...",
          khuVucMongMuon: "Đang chọn..."
        }
      });

      // 3. Cập nhật phiếu mới nhất cho tài khoản
      await tx.taiKhoan.update({
        where: { idTaiKhoan: idTaiKhoanToken },
        data: { phieuMoiNhatId: phieu.idPhieu }
      });

      return { customer, phieu };
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
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
    const { customer, room, bookingDetails } = req.body;
    const idTaiKhoanToken = 464; // Giả định ID test

    const result = await prisma.$transaction(async (tx) => {
      // 1. Tạo/Cập nhật Khách hàng
      const kh = await tx.khachHang.upsert({
        where: { cccd: customer.cccd },
        update: { hoTen: customer.hoTen, sdt: customer.sdt, email: customer.email, idTaiKhoan: idTaiKhoanToken },
        create: { hoTen: customer.hoTen, sdt: customer.sdt, email: customer.email, cccd: customer.cccd, idTaiKhoan: idTaiKhoanToken }
      });

      // 2. Tạo Phiếu yêu cầu với THÔNG TIN PHÒNG DYNAMIC
      const phieu = await tx.phieuYeuCau.create({
        data: {
          hinhThucThue: 'O_GHEP',
          soNguoi: parseInt(bookingDetails.guests) || 1,
          loaiPhong: room.name,        // Lưu: "Phòng Master tầng 3"
          khuVucMongMuon: room.address // Lưu: "District 5, Ho Chi Minh City"
        }
      });

      // 3. Nối quan hệ với Tài khoản
      await tx.taiKhoan.update({
        where: { idTaiKhoan: idTaiKhoanToken },
        data: { phieuMoiNhatId: phieu.idPhieu }
      });

      // 4. Tạo Lịch xem phòng
      const lich = await tx.lichXemPhong.create({
        data: {
          idPhieu: phieu.idPhieu,
          thoiGianHen: new Date(bookingDetails.date),
          diaDiem: "Tại: " + room.name, // Địa điểm xem chính là phòng đó
          ttLichHen: 'CHUA_XEM'
        }
      });

      return { kh, phieu, lich };
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};