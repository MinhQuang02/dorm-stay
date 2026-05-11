const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_DEPOSIT_MULTIPLIER = 2;

function resolvePaymentMethod(method) {
  return method === 'CHUYEN_KHOAN' ? 'CHUYEN_KHOAN' : 'TIEN_MAT';
}

async function getCustomerAndApprovedRequest(userId) {
  const customer = await prisma.khachHang.findFirst({
    where: { idTaiKhoan: parseInt(userId, 10) },
    include: {
      taiKhoan: {
        select: { phieuMoiNhatId: true }
      },
      phieuYeuCau: {
        include: {
          lichXemPhongs: {
            orderBy: { idLichHen: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  if (!customer) return { customer: null, request: null, latestSchedule: null };

  const requestId = customer.taiKhoan?.phieuMoiNhatId || customer.phieuYeuCauId;
  if (!requestId) return { customer, request: null, latestSchedule: null };

  const request = await prisma.phieuYeuCau.findUnique({
    where: { idPhieu: requestId },
    include: {
      lichXemPhongs: {
        orderBy: { idLichHen: 'desc' },
        take: 1
      }
    }
  });

  const latestSchedule = request?.lichXemPhongs?.[0] || null;
  return { customer, request, latestSchedule };
}

async function resolveBedFromApprovedRequest({ bedId, roomId, request }) {
  const parsedBedId = bedId ? parseInt(bedId, 10) : null;
  const parsedRoomId = roomId ? parseInt(roomId, 10) : null;

  if (parsedBedId) {
    return prisma.giuong.findUnique({
      where: { idGiuong: parsedBedId },
      include: { phong: true }
    });
  }

  if (parsedRoomId) {
    return prisma.giuong.findFirst({
      where: { idPhong: parsedRoomId, trangThai: true, idKhachHang: null },
      orderBy: { giaGiuong: 'asc' },
      include: { phong: true }
    });
  }

  const requestedType = request?.loaiPhong?.trim();
  if (requestedType) {
    return prisma.giuong.findFirst({
      where: {
        trangThai: true,
        idKhachHang: null,
        phong: {
          loaiPhong: { contains: requestedType, mode: 'insensitive' }
        }
      },
      orderBy: { giaGiuong: 'asc' },
      include: { phong: true }
    });
  }

  return prisma.giuong.findFirst({
    where: { trangThai: true, idKhachHang: null },
    orderBy: { giaGiuong: 'asc' },
    include: { phong: true }
  });
}

function buildDepositPreview(customer, bed, customAmount) {
  const requiredDeposit = typeof customAmount === 'number'
    ? customAmount
    : bed.giaGiuong * DEFAULT_DEPOSIT_MULTIPLIER;

  return {
    customerId: customer.idKhachHang,
    customerName: customer.hoTen,
    roomId: bed.idPhong,
    roomType: bed.phong?.loaiPhong || null,
    bedId: bed.idGiuong,
    bedPrice: bed.giaGiuong,
    depositMultiplier: DEFAULT_DEPOSIT_MULTIPLIER,
    requiredDeposit,
    expiresInHours: 24
  };
}

// LOOKUP CUSTOMER + PHIEU YEU CAU
const lookupCustomer = async (req, res) => {
  try {
    const { hoTen, sdt } = req.query;

    if (!hoTen || !sdt) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ tên và số điện thoại.' });
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
                phong: true
              }
            }
          }
        }
      }
    });

    if (!khachHang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    res.json({ success: true, data: khachHang });
  } catch (error) {
    console.error('lookupCustomer error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tra cứu khách hàng.' });
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
    console.error('getConditions error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải điều kiện lưu trú.' });
  }
};

// GET ROOMS (DANH SÁCH PHÒNG CHO ĐẶT CỌC)
const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.phong.findMany({
      select: {
        idPhong: true,
        loaiPhong: true,
        trangThai: true
      },
      orderBy: {
        idPhong: 'asc'
      }
    });

    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error('getRooms error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách phòng.' });
  }
};

// Deposit In - Preview (must read from approved registration request)
const getDepositPreview = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { roomId, bedId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId.' });
    }

    const { customer, request, latestSchedule } = await getCustomerAndApprovedRequest(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (!request) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy phiếu đăng ký để duyệt đặt cọc.' });
    }

    if (!latestSchedule || latestSchedule.ttLichHen !== 'DA_XEM' || latestSchedule.ttSauHen === 'KHONG_CHON') {
      return res.status(400).json({ success: false, message: 'Phiếu đăng ký chưa được approve để đặt cọc.' });
    }

    const bed = await resolveBedFromApprovedRequest({ bedId, roomId, request });
    if (!bed || !bed.trangThai || bed.idKhachHang) {
      return res.status(404).json({ success: false, message: 'Không còn giường trống phù hợp với phiếu đăng ký.' });
    }

    const preview = buildDepositPreview(customer, bed);
    return res.json({ success: true, preview, requestId: request.idPhieu });
  } catch (error) {
    console.error('getDepositPreview error:', error);
    return res.status(500).json({ success: false, message: 'Server error loading deposit preview.' });
  }
};

// Deposit In - Pay
const payDeposit = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { roomId, bedId, amount, paymentMethod } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId.' });
    }

    const { customer, request, latestSchedule } = await getCustomerAndApprovedRequest(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (!request) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy phiếu đăng ký để duyệt đặt cọc.' });
    }

    if (!latestSchedule || latestSchedule.ttLichHen !== 'DA_XEM' || latestSchedule.ttSauHen === 'KHONG_CHON') {
      return res.status(400).json({ success: false, message: 'Phiếu đăng ký chưa được approve để đặt cọc.' });
    }

    const bed = await resolveBedFromApprovedRequest({ bedId, roomId, request });
    if (!bed || !bed.trangThai || bed.idKhachHang) {
      return res.status(404).json({ success: false, message: 'Không còn giường trống phù hợp với phiếu đăng ký.' });
    }

    const preview = buildDepositPreview(customer, bed);
    const paidAmount = parseFloat(amount ?? preview.requiredDeposit);
    if (Number.isNaN(paidAmount) || paidAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount.' });
    }
    if (paidAmount < preview.requiredDeposit) {
      return res.status(400).json({ success: false, message: `Deposit amount is not enough. Required: ${preview.requiredDeposit}` });
    }

    const phuongThuc = resolvePaymentMethod(paymentMethod);
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.ttoanDatCoc.create({
        data: {
          tienCoc: preview.requiredDeposit,
          tienDaTra: paidAmount,
          thoiDiem: now,
          phuongThuc: phuongThuc,
          trangThai: 'THANH_CONG'
        }
      });

      await tx.ttinDatCoc.create({
        data: {
          idThanhToan: payment.idThanhToan,
          idKhachHang: customer.idKhachHang,
          idGiuong: bed.idGiuong
        }
      });

      const invoice = await tx.hoaDon.create({
        data: {
          tienDaTra: paidAmount,
          chungTu: `DEPOSIT_${customer.idKhachHang}_${Date.now()}`
        }
      });

      await tx.hoaDonDatCoc.create({
        data: {
          idHoaDon: invoice.idHoaDon,
          idThanhToan: payment.idThanhToan
        }
      });

      const reserved = await tx.giuong.updateMany({
        where: { idGiuong: bed.idGiuong, trangThai: true, idKhachHang: null },
        data: { trangThai: false, idKhachHang: customer.idKhachHang }
      });

      if (reserved.count === 0) {
        throw new Error('Selected bed is no longer available.');
      }

      if (latestSchedule?.idLichHen) {
        await tx.lichXemPhong.update({
          where: { idLichHen: latestSchedule.idLichHen },
          data: { ttSauHen: 'DAT_COC' }
        });
      }

      return { payment, invoice };
    });

    return res.json({
      success: true,
      invoice: {
        invoiceId: result.invoice.idHoaDon,
        paymentId: result.payment.idThanhToan,
        customerId: customer.idKhachHang,
        customerName: customer.hoTen,
        requestId: request.idPhieu,
        roomId: bed.idPhong,
        roomType: bed.phong?.loaiPhong || null,
        bedId: bed.idGiuong,
        amount: paidAmount,
        requiredDeposit: preview.requiredDeposit,
        paymentMethod: phuongThuc,
        paidAt: now.toISOString()
      }
    });
  } catch (error) {
    console.error('payDeposit error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error processing deposit payment.' });
  }
};

const calculateDepositOut = async (req, res) => {
  try {
    res.json({ success: false, message: 'Not implemented yet.' });
  } catch (error) {
    console.error('calculateDepositOut error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const finalizeDepositOut = async (req, res) => {
  try {
    res.json({ success: false, message: 'Not implemented yet.' });
  } catch (error) {
    console.error('finalizeDepositOut error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  lookupCustomer,
  getConditions,
  getRooms,
  getDepositPreview,
  payDeposit,
  calculateDepositOut,
  finalizeDepositOut
};