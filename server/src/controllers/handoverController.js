const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET CONTRACTS THAT HAVE RESIDENCE RECORDS
const getHandoverContracts = async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    const hopDongs = await prisma.hopDongThue.findMany({
      where: {
        // Chỉ lấy hợp đồng đã có ChiTietHopDongThue (đã ghi nhận cư trú)
        chiTiets: { some: {} },
        trangThai: { not: 'HET_HAN' },
      },
      include: {
        chiTiets: {
          include: {
            khachHang: true,
            giuong: { include: { phong: true } },
          },
        },
        bienBans: { select: { idBienBan: true } },
      },
      orderBy: { ngayLap: 'desc' },
    });

    // Flatten: mỗi ChiTiet là 1 row (1 khách/1 giường trong hợp đồng)
    let rows = hopDongs.flatMap((hd) =>
      hd.chiTiets.map((ct) => ({
        idHopDong:    hd.idHopDong,
        trangThai:    hd.trangThai,
        ngayBatDau:   hd.ngayBatDau,
        ngayKetThuc:  hd.ngayKetThuc,
        hinhThuc:     hd.hinhThuc,
        idPhong:      ct.giuong?.phong?.idPhong   || null,
        loaiPhong:    ct.giuong?.phong?.loaiPhong || null,
        idGiuong:     ct.giuong?.idGiuong         || null,
        customerName: ct.khachHang?.hoTen         || 'N/A',
        customerId:   ct.khachHang?.idKhachHang   || null,
        // Đã có biên bản bàn giao chưa
        daBanGiao:    hd.bienBans.length > 0,
      }))
    );

    // Search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          String(r.idHopDong).includes(q) ||
          (r.customerName || '').toLowerCase().includes(q) ||
          `r${r.idPhong}`.includes(q) ||
          (r.loaiPhong || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'date') {
      rows.sort((a, b) => new Date(b.ngayBatDau) - new Date(a.ngayBatDau));
    } else if (sortBy === 'status') {
      // Overdue trước, rồi Occupied, rồi Available
      const order = { OVERDUE: 0, DA_THUE: 1, TRONG: 2 };
      rows.sort((a, b) => (order[a.trangThai] ?? 9) - (order[b.trangThai] ?? 9));
    } else {
      // Default: newest idHopDong
      rows.sort((a, b) => b.idHopDong - a.idHopDong);
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('getHandoverContracts error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching handover contracts.' });
  }
};


// GET ASSETS BELONGING TO A ROOM (via QuanLyTaiSan)
const getAssetsByRoom = async (req, res) => {
  try {
    const { idPhong } = req.params;

    const quanLyTaiSans = await prisma.quanLyTaiSan.findMany({
      where: { idPhong: parseInt(idPhong) },
      include: {
        taiSan: true,
      },
    });

    const assets = quanLyTaiSans.map((q) => ({
      idTaiSan:   q.taiSan.idTaiSan,
      tenTaiSan:  q.taiSan.tenTaiSan,
      loaiTaiSan: q.taiSan.loaiTaiSan,
      tinhTrang:  q.taiSan.tinhTrang,
      ngayMua:    q.taiSan.ngayMua,
      giaMua:     q.taiSan.giaMua,
      ghiChu:     q.ghiChu,
    }));

    res.json({ success: true, data: assets });
  } catch (error) {
    console.error('getAssetsByRoom error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching assets.' });
  }
};

// CREATE HANDOVER RECORD
const createHandoverRecord = async (req, res) => {
  try {
    const { idHopDong, noiDung, trangThai, assets } = req.body;

    if (!idHopDong) {
      return res.status(400).json({ success: false, message: 'Missing required field: idHopDong.' });
    }
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({ success: false, message: 'Asset list is required.' });
    }

    // Check contract exists
    const hopDong = await prisma.hopDongThue.findUnique({
      where: { idHopDong: parseInt(idHopDong) },
    });
    if (!hopDong) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. INSERT BienBanBanGiao
      const bienBan = await tx.bienBanBanGiao.create({
        data: {
          idHopDong: parseInt(idHopDong),
          noiDung:   noiDung   || null,
          trangThai: trangThai || 'HOAN_TAT',
        },
      });

      // 2. INSERT ChiTietBanGiao for each asset
      await tx.chiTietBanGiao.createMany({
        data: assets.map((a) => ({
          idBienBan: bienBan.idBienBan,
          idTaiSan:  parseInt(a.idTaiSan),
          tinhTrang: a.tinhTrang || 'BINH_THUONG',
          hdSuDung:  a.hdSuDung  || null,
        })),
      });

      // 3. UPDATE tinhTrang from each asset in TaiSan
      await Promise.all(
        assets.map((a) =>
          tx.taiSan.update({
            where: { idTaiSan: parseInt(a.idTaiSan) },
            data:  { tinhTrang: a.tinhTrang || 'BINH_THUONG' },
          })
        )
      );

      // 4. Return full BienBan with chiTiets
      return tx.bienBanBanGiao.findUnique({
        where: { idBienBan: bienBan.idBienBan },
        include: {
          chiTiets: { include: { taiSan: true } },
          hopDong: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: 'Handover record created successfully.',
      data: result,
    });
  } catch (error) {
    console.error('createHandoverRecord error:', error);
    res.status(500).json({ success: false, message: 'Server error creating handover record.' });
  }
};


// GET HANDOVER RECORD BY CONTRACT ID
const getHandoverByContract = async (req, res) => {
  try {
    const { idHopDong } = req.params;

    const bienBan = await prisma.bienBanBanGiao.findFirst({
      where: { idHopDong: parseInt(idHopDong) },
      include: {
        chiTiets: { include: { taiSan: true } },
        hopDong: {
          include: {
            chiTiets: { include: { khachHang: true, giuong: { include: { phong: true } } } },
          },
        },
      },
      orderBy: { ngayLap: 'desc' },
    });

    if (!bienBan) {
      return res.status(404).json({ success: false, message: 'Handover record not found.' });
    }

    res.json({ success: true, data: bienBan });
  } catch (error) {
    console.error('getHandoverByContract error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching handover record.' });
  }
};

module.exports = {
  getHandoverContracts,
  getAssetsByRoom,
  createHandoverRecord,
  getHandoverByContract,
};
