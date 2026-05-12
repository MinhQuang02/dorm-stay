const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET CONTRACT DETAIL FOR PAYMENT PAGE
const getContractForPayment = async (req, res) => {
  try {
    const { idHopDong } = req.params;

    const hopDong = await prisma.hopDongThue.findUnique({
      where: { idHopDong: parseInt(idHopDong) },
      include: {
        nguoiLap: true,
        phieu: true,
        chiTiets: {
          include: {
            khachHang: true,
            giuong: {
              include: { phong: true },
            },
          },
        },
        ctDichVus: {
          include: { dichVu: true },
        },
        ttoanDinhKys: {
          orderBy: { thoiGianTT: 'desc' },
          take: 5,
        },
      },
    });

    if (!hopDong) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    // ── Build cost breakdown ──
    // 1. Giá giường (base rent) — lấy từ ChiTiet đầu tiên
    const firstCT  = hopDong.chiTiets[0];
    const bedPrice = firstCT?.giuong?.giaGiuong || 0;

    // 2. Chi phí điện nước từ Phong
    const utilityFee = firstCT?.giuong?.phong?.chiPhiDienNuoc || 0;

    // 3. Dịch vụ đi kèm từ ChiTietDichVuThue
    const services = hopDong.ctDichVus.map((ct) => ({
      name:   ct.dichVu.tenDichVu,
      amount: ct.dichVu.donGia,
    }));

    const serviceTotal = services.reduce((s, x) => s + x.amount, 0);
    const totalAmount  = bedPrice + utilityFee + serviceTotal;

    // ── Owners: tất cả khách trong hợp đồng ──
    const owners = hopDong.chiTiets.map((ct) => ct.khachHang?.hoTen).filter(Boolean);

    const result = {
      idHopDong:     hopDong.idHopDong,
      contractCode:  `#${String(hopDong.ngayLap.getFullYear())}-${String(hopDong.ngayLap.getMonth() + 1).padStart(2, '0')}-${String(hopDong.idHopDong).padStart(4, '0')}`,
      hinhThuc:      hopDong.hinhThuc,
      ngayLap:       hopDong.ngayLap,
      ngayBatDau:    hopDong.ngayBatDau,
      ngayKetThuc:   hopDong.ngayKetThuc,
      trangThai:     hopDong.trangThai,
      kyThanhToan:   hopDong.kyThanhToan,
      creatorName:   hopDong.nguoiLap?.hoTen || 'N/A',
      owners,
      // Cost breakdown
      bedPrice,
      utilityFee,
      services,
      totalAmount,
      // Payment history
      paymentHistory: hopDong.ttoanDinhKys,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('getContractForPayment error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching contract.' });
  }
};

// GET ALL CONTRACTS BELONGING TO LOGGED-IN USER
const getMyContracts = async (req, res) => {
  try {
    // req.user.id là idTaiKhoan từ JWT
    const idTaiKhoan = req.user?.id;
    if (!idTaiKhoan) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const khachHang = await prisma.khachHang.findFirst({
      where: { idTaiKhoan: parseInt(idTaiKhoan) },
    });
    if (!khachHang) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const chiTiets = await prisma.chiTietHopDongThue.findMany({
      where: { idKhachHang: khachHang.idKhachHang },
      include: {
        hopDong: {
          include: {
            nguoiLap: true,
            chiTiets: {
              include: {
                khachHang: true,
                giuong: { include: { phong: true } },
              },
            },
            ctDichVus: { include: { dichVu: true } },
            ttoanDinhKys: { orderBy: { thoiGianTT: 'desc' }, take: 1 },
          },
        },
        giuong: { include: { phong: true } },
      },
      orderBy: { idHopDong: 'desc' },
    });

    const contracts = chiTiets.map((ct) => {
      const hd        = ct.hopDong;
      const bedPrice  = ct.giuong?.giaGiuong || 0;
      const utility   = ct.giuong?.phong?.chiPhiDienNuoc || 0;
      const services  = hd.ctDichVus.map((s) => ({ name: s.dichVu.tenDichVu, amount: s.dichVu.donGia }));
      const total     = bedPrice + utility + services.reduce((s, x) => s + x.amount, 0);
      const owners    = hd.chiTiets.map((c) => c.khachHang?.hoTen).filter(Boolean);

      return {
        idHopDong:    hd.idHopDong,
        contractCode: `#${String(hd.ngayLap.getFullYear())}-${String(hd.ngayLap.getMonth() + 1).padStart(2, '0')}-${String(hd.idHopDong).padStart(4, '0')}`,
        hinhThuc:     hd.hinhThuc,
        ngayLap:      hd.ngayLap,
        ngayBatDau:   hd.ngayBatDau,
        ngayKetThuc:  hd.ngayKetThuc,
        trangThai:    hd.trangThai,
        kyThanhToan:  hd.kyThanhToan,
        creatorName:  hd.nguoiLap?.hoTen || 'N/A',
        owners,
        totalAmount:  total,
        lastPayment:  hd.ttoanDinhKys[0] || null,
      };
    });

    res.json({ success: true, data: contracts });
  } catch (error) {
    console.error('getMyContracts error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching contracts.' });
  }
};

// PROCESS PAYMENT
const processPayment = async (req, res) => {
  try {
    const { idHopDong, tienThanhToan, phuongThuc } = req.body;

    if (!idHopDong || !tienThanhToan || !phuongThuc) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: idHopDong, tienThanhToan, phuongThuc.',
      });
    }

    const hopDong = await prisma.hopDongThue.findUnique({
      where: { idHopDong: parseInt(idHopDong) },
    });
    if (!hopDong) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    const now         = new Date();
    const phuongThucEnum = phuongThuc === 'CHUYEN_KHOAN' ? 'CHUYEN_KHOAN' : 'TIEN_MAT';
    const chungTu     = `PAY-${idHopDong}-${Date.now()}`;
    const kyThanhToan = `Kỳ tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. INSERT TtoanDinhKy
      const ttoan = await tx.ttoanDinhKy.create({
        data: {
          idHopDong:    parseInt(idHopDong),
          thoiGianTT:   now,
          tienThanhToan: parseFloat(tienThanhToan),
          tienConThieu:  0,
          kyThanhToan,
          phuongThuc:   phuongThucEnum,
        },
      });

      // 2. INSERT HoaDon (base)
      const hoaDon = await tx.hoaDon.create({
        data: {
          tienDaTra: parseFloat(tienThanhToan),
          chungTu,
        },
      });

      // 3. INSERT HoaDonDinhKy (link HoaDon ↔ TtoanDinhKy)
      await tx.hoaDonDinhKy.create({
        data: {
          idHoaDon:   hoaDon.idHoaDon,
          idHopDong:  parseInt(idHopDong),
          thoiGianTT: ttoan.thoiGianTT,
        },
      });

      // 4. UPDATE trangThai HopDongThue nếu cần
      await tx.hopDongThue.update({
        where: { idHopDong: parseInt(idHopDong) },
        data: { trangThai: hopDong.trangThai }, // giữ nguyên, chỉ trigger update
      });

      return { ttoan, hoaDon, chungTu, kyThanhToan };
    });

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully.',
      data: {
        invoiceId:     result.hoaDon.idHoaDon,
        chungTu:       result.chungTu,
        kyThanhToan:   result.kyThanhToan,
        tienThanhToan: parseFloat(tienThanhToan),
        phuongThuc:    phuongThucEnum,
        paidAt:        now.toISOString(),
      },
    });
  } catch (error) {
    console.error('processPayment error:', error);
    res.status(500).json({ success: false, message: 'Server error processing payment.' });
  }
};

module.exports = {
  getMyContracts,
  getContractForPayment,
  processPayment,
};
