const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// LOOKUP CUSTOMER + PHIEU YEU CAU
const lookupCustomer = async (req, res) => {
  try {
    const { hoTen, sdt } = req.query;

    if (!hoTen || !sdt) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập họ tên và số điện thoại." });
    }

    const khachHang = await prisma.khachHang.findFirst({
      where: {
        hoTen: {
          equals: hoTen.trim(),
          mode: 'insensitive'
        },
        sdt: sdt.trim()
      },
      include: {
        phieuYeuCau: true,
        ttinDatCocs: {
          include: {
            ttoan: true,
            giuong: {
              include: {
                phong: true,
              },
            },
          },
        },
      },
    });

    if (!khachHang) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng." });
    }

    res.json({ success: true, data: khachHang });
  } catch (error) {
    console.error("lookupCustomer error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi tra cứu khách hàng." });
  }
};

// GET CONDITIONS (ĐIỀU KIỆN LƯU TRÚ)
const getConditions = async (req, res) => {
  try {
    const conditions = await prisma.dieuKienLuuTru.findMany({
      select: {
        idDieuKien: true,
        tenDieuKien: true,
        moTa: true
      },
      orderBy: {
        idDieuKien: 'asc'
      }
    });

    res.json({ success: true, data: conditions });
  } catch (error) {
    console.error("getConditions error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi tải điều kiện lưu trú." });
  }
};

// GET ROOMS (DANH SÁCH PHÒNG CHO ĐẶT CỌC)
const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.phong.findMany({
      select: {
        idPhong: true,
        loaiPhong: true, 
        trangThai: true,
      },
      orderBy: {
        idPhong: 'asc',
      }
    });
    
    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách phòng." });
  }
};

const calculateDepositOut = async (req, res) => {
  try {
    res.json({ success: false, message: "Not implemented yet." });
  } catch (error) {
    console.error("calculateDepositOut error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const finalizeDepositOut = async (req, res) => {
  try {
    res.json({ success: false, message: "Not implemented yet." });
  } catch (error) {
    console.error("finalizeDepositOut error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  lookupCustomer,
  getConditions,
  getRooms,
  calculateDepositOut,
  finalizeDepositOut
};