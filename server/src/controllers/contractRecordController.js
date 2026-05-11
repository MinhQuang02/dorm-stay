const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ROOMS WITH SEARCH & SORT
const getRooms = async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    const phongs = await prisma.phong.findMany({
      where: search
        ? {
            OR: [
              { loaiPhong: { contains: search, mode: "insensitive" } },
              { idPhong: isNaN(parseInt(search)) ? undefined : parseInt(search) },
            ],
          }
        : undefined,
      include: {
        giuongs: {
          select: {
            idGiuong: true,
            giaGiuong: true,
            trangThai: true,
            viTri: true,
          },
        },
      },
      orderBy: sortBy === "price" ? { giuongs: { _count: "asc" } } : { idPhong: "asc" },
    });

    // Flatten: Each bed is a row in the Room List
    const rows = phongs.flatMap((phong) =>
      phong.giuongs.map((giuong) => ({
        idPhong: phong.idPhong,
        idGiuong: giuong.idGiuong,
        loaiPhong: phong.loaiPhong,
        sucChua: phong.sucChua,
        giaGiuong: giuong.giaGiuong,
        trangThaiGiuong: giuong.trangThai, // true = available, false = rented
        trangThaiPhong: phong.trangThai,
        viTri: giuong.viTri,
      }))
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách phòng." });
  }
};

// GET CONTRACT BY ID (FOR CONTRACT DETAILS PAGE)
const getContractById = async (req, res) => {
  try {
    const { idHopDong } = req.params;

    const hopDong = await prisma.hopDongThue.findUnique({
      where: { idHopDong: parseInt(idHopDong) },
      include: {
        phieu: true,
        chiTiets: {
          include: {
            khachHang: true,
            giuong: { include: { phong: true } },
          },
        },
      },
    });

    if (!hopDong) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
    }

    res.json({ success: true, data: hopDong });
  } catch (error) {
    console.error("getContractById error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy hợp đồng." });
  }
};

// GET ACTIVE CONTRACTS (EXCLUDE EXPIRED)
const getActiveContracts = async (req, res) => {
  try {
    const hopDongs = await prisma.hopDongThue.findMany({
      where: {
        trangThai: { not: "HET_HAN" },
      },
      include: {
        phieu: true,
        chiTiets: {
          include: { khachHang: true },
        },
      },
      orderBy: { ngayLap: "desc" },
    });

    res.json({ success: true, data: hopDongs });
  } catch (error) {
    console.error("getActiveContracts error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách hợp đồng." });
  }
};

// RECORD RESIDENCE - Cập nhật đồng bộ Ngày bắt đầu & Ngày kết thúc
const recordResidence = async (req, res) => {
  try {
    // 1. Nhận thêm cả beginDate và endDate
    const { idKhachHang, idHopDong, idGiuong, thongTinCT, isFullRoom, idPhong, beginDate, endDate } = req.body;

    console.log("=== DỮ LIỆU TỪ FRONTEND GỬI XUỐNG ===", req.body);
    
    if (!idKhachHang || !idHopDong || !idGiuong) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: idKhachHang, idHopDong, idGiuong.",
      });
    }

    const khachHang = await prisma.khachHang.findUnique({ where: { idKhachHang: parseInt(idKhachHang) } });
    if (!khachHang) return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng." });

    const hopDong = await prisma.hopDongThue.findUnique({ where: { idHopDong: parseInt(idHopDong) } });
    if (!hopDong) return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });

    const giuong = await prisma.giuong.findUnique({ where: { idGiuong: parseInt(idGiuong) } });
    if (!giuong) return res.status(404).json({ success: false, message: "Không tìm thấy giường." });
    if (!giuong.trangThai) return res.status(400).json({ success: false, message: "Giường này đã được sử dụng." });

    const existing = await prisma.chiTietHopDongThue.findFirst({
      where: {
        idKhachHang: parseInt(idKhachHang),
        idHopDong: parseInt(idHopDong),
        idGiuong: parseInt(idGiuong),
      },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Thông tin cư trú này đã được ghi nhận trước đó." });
    }

    // Transaction: INSERT ChiTietHopDongThue + UPDATE TrangThai + UPDATE Ngày
    const result = await prisma.$transaction(async (tx) => {
      
      // 2. Cập nhật đồng thời CẢ HAI ngày vào Hợp đồng
      const updateData = {};
      if (beginDate) updateData.ngayBatDau = new Date(beginDate);
      if (endDate)   updateData.ngayKetThuc = new Date(endDate);
      
      if (Object.keys(updateData).length > 0) {
        await tx.hopDongThue.update({
          where: { idHopDong: parseInt(idHopDong) },
          data: updateData 
        });
      }

      // 3. Tạo bản ghi chi tiết cư trú (thongTinCT giờ đã sạch đẹp)
      const chiTiet = await tx.chiTietHopDongThue.create({
        data: {
          idKhachHang: parseInt(idKhachHang),
          idHopDong: parseInt(idHopDong),
          idGiuong: parseInt(idGiuong), 
          thongTinCT: thongTinCT, 
        },
      });

      // 4. Khóa giường
      if (isFullRoom && idPhong) {
        await tx.giuong.updateMany({
          where: { idPhong: parseInt(idPhong) },
          data: { trangThai: false }
        });
      } else {
        await tx.giuong.update({
          where: { idGiuong: parseInt(idGiuong) },
          data: { trangThai: false },
        });
      }

      return chiTiet;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Lỗi recordResidence:", error);
    res.status(500).json({ success: false, message: "Lỗi ghi nhận cư trú." });
  }
};

// FIND CUSTOMER BY CCCD OR SĐT (Giữ đúng logic của bạn ở tam.js)
const findCustomer = async (req, res) => {
  try {
    const { cccd, sdt } = req.query;

    if (!cccd && !sdt) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập CCCD hoặc SĐT." });
    }

    const khachHang = await prisma.khachHang.findFirst({
      where: {
        OR: [
          cccd ? { cccd } : undefined,
          sdt ? { sdt } : undefined,
        ].filter(Boolean),
      },
    });

    if (!khachHang) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng." });
    }

    res.json({ success: true, data: khachHang });
  } catch (error) {
    console.error("findCustomer error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi tìm khách hàng." });
  }
};

module.exports = {
  getRooms,
  getContractById,
  getActiveContracts,
  recordResidence,
  findCustomer
};