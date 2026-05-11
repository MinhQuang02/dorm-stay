const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_DEPOSIT_MULTIPLIER = 2;

function resolvePaymentMethod(method) {
  return method === 'CHUYEN_KHOAN' ? 'CHUYEN_KHOAN' : 'TIEN_MAT';
}

async function findCustomerByUserId(userId) {
  return prisma.khachHang.findFirst({
    where: { idTaiKhoan: parseInt(userId, 10) },
    include: {
      taiKhoan: {
        select: { phieuMoiNhatId: true }
      }
    }
  });
}

async function resolveBed({ bedId, roomId }) {
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

  return null;
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

// =========================
// Deposit In
// =========================
exports.getDepositPreview = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { roomId, bedId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId.' });
    }

    const customer = await findCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const bed = await resolveBed({ bedId, roomId });
    if (!bed) {
      return res.status(404).json({ error: 'No available bed found for deposit.' });
    }

    if (!bed.trangThai || bed.idKhachHang) {
      return res.status(400).json({ error: 'Selected bed is not available.' });
    }

    const preview = buildDepositPreview(customer, bed);
    return res.json({ success: true, preview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error loading deposit preview.' });
  }
};

exports.payDeposit = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { roomId, bedId, amount, paymentMethod } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId.' });
    }

    const customer = await findCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const bed = await resolveBed({ bedId, roomId });
    if (!bed) {
      return res.status(404).json({ error: 'No available bed found for deposit.' });
    }

    if (!bed.trangThai || bed.idKhachHang) {
      return res.status(400).json({ error: 'Selected bed is not available.' });
    }

    const preview = buildDepositPreview(customer, bed);
    const paidAmount = parseFloat(amount ?? preview.requiredDeposit);

    if (Number.isNaN(paidAmount) || paidAmount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount.' });
    }

    if (paidAmount < preview.requiredDeposit) {
      return res.status(400).json({
        error: `Deposit amount is not enough. Required: ${preview.requiredDeposit}`
      });
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

      const chungTu = `DEPOSIT_${customer.idKhachHang}_${Date.now()}`;
      const invoice = await tx.hoaDon.create({
        data: {
          tienDaTra: paidAmount,
          chungTu
        }
      });

      await tx.hoaDonDatCoc.create({
        data: {
          idHoaDon: invoice.idHoaDon,
          idThanhToan: payment.idThanhToan
        }
      });

      const updated = await tx.giuong.updateMany({
        where: { idGiuong: bed.idGiuong, trangThai: true, idKhachHang: null },
        data: { trangThai: false, idKhachHang: customer.idKhachHang }
      });
      if (updated.count === 0) {
        throw new Error('Selected bed is no longer available.');
      }

      const currentPhieuId = customer.taiKhoan?.phieuMoiNhatId;
      if (currentPhieuId) {
        const latestSchedule = await tx.lichXemPhong.findFirst({
          where: { idPhieu: currentPhieuId },
          orderBy: { idLichHen: 'desc' }
        });

        if (latestSchedule) {
          await tx.lichXemPhong.update({
            where: { idLichHen: latestSchedule.idLichHen },
            data: { ttSauHen: 'DAT_COC' }
          });
        }
      }

      return { payment, invoice, chungTu };
    });

    return res.json({
      success: true,
      invoice: {
        invoiceId: result.invoice.idHoaDon,
        paymentId: result.payment.idThanhToan,
        customerId: customer.idKhachHang,
        customerName: customer.hoTen,
        roomId: bed.idPhong,
        roomType: bed.phong?.loaiPhong || null,
        bedId: bed.idGiuong,
        amount: paidAmount,
        requiredDeposit: preview.requiredDeposit,
        paymentMethod: phuongThuc,
        chungTu: result.chungTu,
        paidAt: now.toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Server error processing deposit payment.' });
  }
};

// =========================
// Deposit Out
// =========================
exports.calculateDepositOut = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing identity' });

    const customer = await prisma.khachHang.findFirst({
      where: { idTaiKhoan: parseInt(userId, 10) },
      include: {
        ttinDatCocs: {
          orderBy: { idThanhToan: 'desc' },
          include: { ttoan: true }
        },
        chiTietHopDongs: {
          orderBy: { idHopDong: 'desc' },
          include: {
            hopDong: {
              include: {
                nguoiLap: true,
                ttoanDinhKys: true,
                banGhis: true
              }
            },
            giuong: {
              include: { phong: true }
            }
          }
        }
      }
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const latestDatCoc = customer.ttinDatCocs[0];
    if (!latestDatCoc) return res.status(400).json({ error: 'No deposit found for this user.' });

    const initialDeposit = latestDatCoc.ttoan.tienDaTra;
    const latestContractDetail = customer.chiTietHopDongs[0];
    const contract = latestContractDetail?.hopDong;

    let result = {
      customerId: customer.idKhachHang,
      customerName: customer.hoTen,
      cccd: customer.cccd,
      roomType: latestContractDetail?.giuong?.phong?.loaiPhong || null,
      bedId: latestContractDetail?.giuong?.idGiuong || null,
      roomId: latestContractDetail?.giuong?.idPhong || null,
      contractId: contract?.idHopDong || null,
      contractStatus: contract?.trangThai || 'Deposit can be refunded',
      rentalForm: contract?.hinhThuc === 'O_GHEP' ? 'By Bed' : (contract?.hinhThuc === 'NGUYEN_CAN' ? 'Full Room/House' : 'Unknown'),
      creatorName: contract?.nguoiLap?.hoTen || 'Unknown',
      startDate: contract?.ngayBatDau || null,
      endDate: contract?.ngayKetThuc || null,
      creationDate: contract?.ngayLap || null,
      paymentPeriod: contract?.kyThanhToan || 'N/A',
      initialDeposit: initialDeposit,
      deductionPercentage: 0,
      breachFee: 0,
      unpaidBills: 0,
      damageCosts: 0,
      finalBalance: 0,
      isDebt: false,
      reason: ''
    };

    if (!contract || contract.trangThai === 'CHUA_KY') {
      result.deductionPercentage = 20;
      result.breachFee = (initialDeposit * 20) / 100;
      result.reason = 'Deducted 20% for terminating deposit without signing contract';
    } else {
      const start = new Date(contract.ngayBatDau);
      const end = new Date(contract.ngayKetThuc);
      const now = new Date();

      const timeStayedMillis = now.getTime() - start.getTime();
      const monthsStayed = timeStayedMillis / (1000 * 60 * 60 * 24 * 30);

      if (now >= end) {
        result.deductionPercentage = 0;
        result.breachFee = 0;
        result.reason = 'Contract fully expired. 0% penalty.';
      } else if (monthsStayed < 6) {
        result.deductionPercentage = 50;
        result.breachFee = (initialDeposit * 50) / 100;
        result.reason = 'Stayed < 6 months. Deduct 50% deposit.';
      } else {
        result.deductionPercentage = 30;
        result.breachFee = (initialDeposit * 30) / 100;
        result.reason = 'Stayed >= 6 months but terminated early. Deduct 30% deposit.';
      }

      const missingPayments = contract.ttoanDinhKys.reduce((sum, pk) => sum + (pk.tienConThieu > 0 ? pk.tienConThieu : 0), 0);
      result.unpaidBills = missingPayments;

      const damages = contract.banGhis.reduce((sum, bg) => sum + bg.tienCanTra, 0);
      result.damageCosts = damages;
    }

    const finalAmount = initialDeposit - result.breachFee - result.unpaidBills - result.damageCosts;

    result.finalBalance = Math.abs(finalAmount);
    result.isDebt = finalAmount < 0;

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error calculating finance.' });
  }
};

exports.finalizeDepositOut = async (req, res) => {
  const { contractId, bedId, finalBalance, isDebt } = req.body;

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const amount = parseFloat(finalBalance);
      const noHayHoan = isDebt ? 'NO' : 'HOAN';

      const report = await tx.baoCaoChiPhi.create({
        data: {
          idHopDong: contractId,
          soTien: amount,
          noHayHoan: noHayHoan
        }
      });

      const baseInvoice = await tx.hoaDon.create({
        data: {
          tienDaTra: amount,
          chungTu: `FINAL_${contractId}_${Date.now()}`
        }
      });

      await tx.hoaDonCoc.create({
        data: {
          idHoaDon: baseInvoice.idHoaDon,
          idBaoCao: report.idBaoCao
        }
      });

      if (contractId) {
        await tx.hopDongThue.update({
          where: { idHopDong: contractId },
          data: { trangThai: 'TERMINATED' }
        });
      }

      if (bedId) {
        await tx.giuong.update({
          where: { idGiuong: bedId },
          data: { trangThai: true, idKhachHang: null }
        });
      }

      return { report, baseInvoice };
    });

    return res.json({
      success: true,
      invoice: {
        invoiceId: transaction.baseInvoice.idHoaDon,
        reportId: transaction.report.idBaoCao,
        contractId: contractId,
        amount: transaction.baseInvoice.tienDaTra,
        chungTu: transaction.baseInvoice.chungTu,
        noHayHoan: transaction.report.noHayHoan,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to finalize deposit out logic.' });
  }
};

// =========================
// Customer + Conditions + Rooms
// =========================
exports.lookupCustomer = async (req, res) => {
  try {
    const { hoTen, sdt } = req.query;

    if (!hoTen || !sdt) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập họ tên và số điện thoại.'
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
        taiKhoan: {
          select: { phieuMoiNhatId: true }
        }
      }
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng.'
      });
    }

    let phieuYeuCau = null;
    if (khachHang.taiKhoan?.phieuMoiNhatId) {
      phieuYeuCau = await prisma.phieuYeuCau.findUnique({
        where: { idPhieu: khachHang.taiKhoan.phieuMoiNhatId }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...khachHang,
        phieuYeuCau
      }
    });
  } catch (error) {
    console.error('LOOKUP CUSTOMER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi server.',
      error: error.message
    });
  }
};

exports.getConditions = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: conditions
    });
  } catch (error) {
    console.error('GET CONDITIONS ERROR:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await prisma.phong.findMany({
      select: {
        idPhong: true,
        loaiPhong: true,
        trangThai: true
      }
    });
    return res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};
