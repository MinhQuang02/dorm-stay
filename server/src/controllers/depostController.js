
// ==========================================
// FILE 1: src/controllers/depostController.js
// ==========================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * =========================================
 * TRA CỨU KHÁCH HÀNG + PHIẾU YÊU CẦU
 * =========================================
 */
const lookupCustomer = async (req, res) => {
  try {
    const { hoTen, sdt } = req.query;

    if (!hoTen || !sdt) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập họ tên và số điện thoại.",
      });
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
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng.",
      });
    }

    return res.status(200).json({
      success: true,
      data: khachHang,
    });

  } catch (error) {
    console.error("LOOKUP CUSTOMER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * LẤY ĐIỀU KIỆN LƯU TRÚ
 * =========================================
 */
const getConditions = async (req, res) => {
  try {
    const conditions = await prisma.dieuKienLuuTru.findMany({
      // Lấy đúng các trường theo schema 
      select: {
        idDieuKien: true,
        tenDieuKien: true,
        moTa: true
      },
      orderBy: {
        idDieuKien: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: conditions,
    });
  } catch (error) {
    console.error("GET CONDITIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Lỗi server." });
  }
};


/**
 * =========================================
 * LẤY DANH SÁCH PHÒNG
 * =========================================
 */
// Đảm bảo getRooms lấy đúng trường tenPhong (trong schema bạn ghi là tenPhong nhưng model lại là loaiPhong)
const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.phong.findMany({
      select: { 
        idPhong: true, 
        loaiPhong: true, 
        trangThai: true,
        sucChua: true,         
        chiPhiDienNuoc: true   
      },
      orderBy: { idPhong: 'asc' }
    });
    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy phòng." });
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

