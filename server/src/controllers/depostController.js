const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// 1. TRA CỨU KHÁCH HÀNG & NHU CẦU THUÊ
// ==========================================
exports.lookupCustomer = async (req, res) => {
  try {
    const { hoTen, sdt } = req.query;

    if (!hoTen || !sdt) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ họ tên và số điện thoại.",
      });
    }

    // Tìm Khách Hàng
    const khachHang = await prisma.khachHang.findFirst({
      where: {
        hoTen: { equals: hoTen, mode: 'insensitive' },
        sdt: sdt,
      },
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng.",
      });
    }

    // Tìm Phiếu Yêu Cầu dựa trên phieuYeuCauId của khách hàng
    let phieuYeuCau = null;
    if (khachHang.phieuYeuCauId) {
      
      console.log(">>> Đang tìm Phiếu ID:", khachHang.phieuYeuCauId); // Thêm dòng này

      phieuYeuCau = await prisma.phieuYeuCau.findUnique({
        where: { idPhieu: khachHang.phieuYeuCauId },
      });

      console.log(">>> Kết quả tìm được:", phieuYeuCau); // Thêm dòng này
    }
    return res.status(200).json({
      success: true,
      data: {
        ...khachHang,
        phieuYeuCau: phieuYeuCau,
      },
    });

  } catch (error) {
    console.error("Lỗi API tra cứu khách hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ.",
      error: error.message,
    });
  }
};


// ==========================================
// 2. CALCULATE DEPOSIT REFUND OR DEBT
// ==========================================
exports.calculateDepositOut = async (req, res) => {
  try {
    const { userId } = req.body; // or khachHangId
    if (!userId) return res.status(400).json({ error: "Missing identity" });

    // 1. Get KhachHang -> TaiKhoan
    const customer = await prisma.khachHang.findFirst({
      where: { idTaiKhoan: parseInt(userId) },
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

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Lấy cọc mới nhất và hợp đồng mới nhất (vị trí 0 do đã orderBy desc)
    const latestDatCoc = customer.ttinDatCocs[0];
    if (!latestDatCoc) return res.status(400).json({ error: "No deposit found for this user." });

    const initialDeposit = latestDatCoc.ttoan.tienDaTra;
    const latestContractDetail = customer.chiTietHopDongs[0];
    const contract = latestContractDetail?.hopDong;

    // Output Base structure
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
      reason: ""
    };

    // Case A: No Signed Contract
    if (!contract || contract.trangThai === "CHUA_KY") {
      result.deductionPercentage = 20;
      result.breachFee = (initialDeposit * 20) / 100;
      result.reason = "Deducted 20% for terminating deposit without signing contract";
    } 
    // Case B: Existing Contract
    else {
      const start = new Date(contract.ngayBatDau);
      const end = new Date(contract.ngayKetThuc);
      const now = new Date();

      const timeStayedMillis = now.getTime() - start.getTime();
      const monthsStayed = timeStayedMillis / (1000 * 60 * 60 * 24 * 30);

      if (now >= end) {
        result.deductionPercentage = 0;
        result.breachFee = 0;
        result.reason = "Contract fully expired. 0% penalty.";
      } else if (monthsStayed < 6) {
        result.deductionPercentage = 50;
        result.breachFee = (initialDeposit * 50) / 100;
        result.reason = "Stayed < 6 months. Deduct 50% deposit.";
      } else {
        result.deductionPercentage = 30;
        result.breachFee = (initialDeposit * 30) / 100;
        result.reason = "Stayed >= 6 months but terminated early. Deduct 30% deposit.";
      }

      // Calculate unpaid bills mapping
      const missingPayments = contract.ttoanDinhKys.reduce((sum, pk) => sum + (pk.tienConThieu > 0 ? pk.tienConThieu : 0), 0);
      result.unpaidBills = missingPayments;

      // Calculate damages
      const damages = contract.banGhis.reduce((sum, bg) => sum + bg.tienCanTra, 0);
      result.damageCosts = damages;
    }

    const finalAmount = initialDeposit - result.breachFee - result.unpaidBills - result.damageCosts;
    
    result.finalBalance = Math.abs(finalAmount);
    result.isDebt = finalAmount < 0;

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error calculating finance." });
  }
};


// ==========================================
// 3. FINALIZE TRANSACTION (PRISMA TRANSACTION)
// ==========================================
exports.finalizeDepositOut = async (req, res) => {
  const { customerId, contractId, bedId, finalBalance, isDebt } = req.body;

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Define debt or refund action
      let amount = parseFloat(finalBalance);
      const noHayHoan = isDebt ? "NO" : "HOAN";
      
      // We create a BaoCaoChiPhi
      const report = await tx.baoCaoChiPhi.create({
        data: {
          idHopDong: contractId,
          soTien: amount,
          noHayHoan: noHayHoan
        }
      });

      // Combine abstract base invoice HoaDon
      const baseInvoice = await tx.hoaDon.create({
        data: {
          tienDaTra: amount,
          chungTu: `FINAL_${contractId}_${Date.now()}`
        }
      });

      // Link to HoaDonCoc
      await tx.hoaDonCoc.create({
        data: {
          idHoaDon: baseInvoice.idHoaDon,
          idBaoCao: report.idBaoCao
        }
      });

      // 2. Update Contract Status
      if(contractId) {
        await tx.hopDongThue.update({
          where: { idHopDong: contractId },
          data: { trangThai: 'TERMINATED' }
        });
      }

      // 3. Update Bed Status
      if(bedId) {
        await tx.giuong.update({
          where: { idGiuong: bedId },
          data: { trangThai: true, idKhachHang: null } // Free up bed
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
    return res.status(500).json({ error: "Failed to finalize deposit out logic." });
  }
};