const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL CONTRACTS FOR USER (WITH PAYMENT STATUS)
exports.getUserContracts = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const customer = await prisma.khachHang.findFirst({
      where: { idTaiKhoan: parseInt(userId) },
      include: {
        chiTietHopDongs: {
          orderBy: { idHopDong: 'desc' },
          include: {
            hopDong: {
              include: {
                nguoiLap: true,
                phieu: true,
                ttoanDinhKys: {
                  orderBy: { thoiGianTT: 'desc' }
                },
                baoCaos: true,
                ctDichVus: { include: { dichVu: true } }
              }
            },
            giuong: { include: { phong: true } }
          }
        }
      }
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const contracts = customer.chiTietHopDongs.map((ct) => {
      const hd = ct.hopDong;
      const latestPayment = hd.ttoanDinhKys[0];
      const totalUnpaid = hd.ttoanDinhKys.reduce((s, t) => s + (t.tienConThieu > 0 ? t.tienConThieu : 0), 0);

      // Determine payment status
      let paymentStatus = 'PENDING';
      if (hd.trangThai === 'TERMINATED') paymentStatus = 'TERMINATED';
      else if (totalUnpaid === 0 && hd.ttoanDinhKys.length > 0) paymentStatus = 'PAID';
      else if (totalUnpaid > 0) paymentStatus = 'PENDING';

      // Build cost breakdown from services + base rent
      const baseRent = ct.giuong?.giaGiuong || 0;
      const serviceCosts = hd.ctDichVus.map(cs => ({ name: cs.dichVu.tenDichVu, amount: cs.dichVu.donGia }));
      const utilityEstimate = ct.giuong?.phong?.chiPhiDienNuoc || 0;
      const totalAmount = baseRent + serviceCosts.reduce((s, x) => s + x.amount, 0) + utilityEstimate + totalUnpaid;

      return {
        contractId: hd.idHopDong,
        status: hd.trangThai,
        paymentStatus,
        rentalForm: hd.hinhThuc === 'O_GHEP' ? 'By Bed' : 'Full Room',
        creatorName: hd.nguoiLap?.hoTen || 'N/A',
        startDate: hd.ngayBatDau,
        endDate: hd.ngayKetThuc,
        creationDate: hd.ngayLap,
        paymentPeriod: hd.kyThanhToan || 'N/A',
        roomType: ct.giuong?.phong?.loaiPhong || 'N/A',
        roomId: ct.giuong?.idPhong || null,
        bedId: ct.giuong?.idGiuong || null,
        bedPrice: baseRent,
        serviceCosts,
        utilityEstimate,
        totalUnpaid,
        totalAmount,
        latestPaymentDate: latestPayment?.thoiGianTT || null,
        latestPaymentPeriod: latestPayment?.kyThanhToan || null,
        customerId: customer.idKhachHang,
        customerName: customer.hoTen,
        cccd: customer.cccd
      };
    });

    return res.json({ contracts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching contracts.' });
  }
};

// PAY A CONTRACT PERIODIC INVOICE (PRISMA TRANSACTION)
exports.payContract = async (req, res) => {
  const { userId, contractId, amount, paymentMethod } = req.body;
  if (!userId || !contractId || !amount) return res.status(400).json({ error: 'Missing required fields.' });

  try {
    // Validate contract belongs to user
    const customer = await prisma.khachHang.findFirst({
      where: { idTaiKhoan: parseInt(userId) }
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });

    const contractDetail = await prisma.chiTietHopDongThue.findFirst({
      where: { idKhachHang: customer.idKhachHang, idHopDong: parseInt(contractId) },
      include: {
        hopDong: {
          include: { ttoanDinhKys: { where: { tienConThieu: { gt: 0 } } } }
        }
      }
    });
    if (!contractDetail) return res.status(403).json({ error: 'Contract does not belong to user or not found.' });
    if (contractDetail.hopDong.trangThai === 'TERMINATED') return res.status(400).json({ error: 'Contract already terminated.' });

    const now = new Date();
    const phuongThuc = paymentMethod === 'CHUYEN_KHOAN' ? 'CHUYEN_KHOAN' : 'TIEN_MAT';

    const result = await prisma.$transaction(async (tx) => {
      // Create new periodic payment record
      const ttoanDK = await tx.ttoanDinhKy.create({
        data: {
          idHopDong: parseInt(contractId),
          thoiGianTT: now,
          tienThanhToan: parseFloat(amount),
          tienConThieu: 0,
          phuongThuc: phuongThuc,
          kyThanhToan: `Thanh toán kỳ ${now.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}`
        }
      });

      // Clear all previous unpaid amounts on existing periodic records
      await tx.ttoanDinhKy.updateMany({
        where: { idHopDong: parseInt(contractId), tienConThieu: { gt: 0 } },
        data: { tienConThieu: 0 }
      });

      // Create base invoice
      const chungTu = `CONTRACT_${contractId}_${Date.now()}`;
      const baseInvoice = await tx.hoaDon.create({
        data: { tienDaTra: parseFloat(amount), chungTu }
      });

      // Link to HoaDonDinhKy
      await tx.hoaDonDinhKy.create({
        data: {
          idHoaDon: baseInvoice.idHoaDon,
          idHopDong: parseInt(contractId),
          thoiGianTT: ttoanDK.thoiGianTT
        }
      });

      return { ttoanDK, baseInvoice, chungTu };
    });

    return res.json({
      success: true,
      invoice: {
        invoiceId: result.baseInvoice.idHoaDon,
        contractId: parseInt(contractId),
        amount: parseFloat(amount),
        chungTu: result.chungTu,
        paymentMethod: phuongThuc,
        paymentPeriod: result.ttoanDK.kyThanhToan,
        paidAt: now.toISOString(),
        customerName: customer.hoTen
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error processing payment.' });
  }
};
