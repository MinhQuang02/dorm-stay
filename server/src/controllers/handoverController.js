const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET CONTRACTS THAT HAVE RESIDENCE RECORDS
const getHandoverContracts = async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    const hopDongs = await prisma.hopDongThue.findMany({
      where: {
        // 1. CHỖ QUAN TRỌNG: Bỏ điều kiện lọc 'HET_HAN' để nó hiện hết
        chiTiets: { some: {} },
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

    let rows = hopDongs.flatMap((hd) =>
      hd.chiTiets.map((ct, index) => ({
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
        
        // Nếu số lượng biên bản ít hơn số lượng người cư trú, 
        // những người mới được thêm vào sau (có index cao hơn) sẽ chưa được bàn giao (false).
        daBanGiao:    index < hd.bienBans.length,
      }))
    );

    // 2. Sửa lại Search: Bỏ chữ "r" để tìm kiếm khớp với Frontend
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          String(r.idHopDong).includes(q) ||
          (r.customerName || '').toLowerCase().includes(q) ||
          String(r.idPhong).includes(q) || 
          (r.loaiPhong || '').toLowerCase().includes(q)
      );
    }

    // (Phần logic Sort giữ nguyên...)
    if (sortBy === 'date') {
      rows.sort((a, b) => new Date(b.ngayBatDau) - new Date(a.ngayBatDau));
    } else if (sortBy === 'status') {
      const order = { OVERDUE: 0, DA_THUE: 1, TRONG: 2 };
      rows.sort((a, b) => (order[a.trangThai] ?? 9) - (order[b.trangThai] ?? 9));
    } else {
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
// CREATE HANDOVER RECORD
const createHandoverRecord = async (req, res) => {
  try {
    const { idHopDong, noiDung, trangThai, assets } = req.body;

    if (!idHopDong) {
      return res.status(400).json({ success: false, message: 'Missing required field: idHopDong.' });
    }
    if (!assets || !Array.isArray(assets)) {
      return res.status(400).json({ success: false, message: 'Asset list is invalid.' });
    }

    // 1. LẤY THÊM CHI TIẾT HỢP ĐỒNG để biết khách đang thuê giường/phòng nào
    const hopDong = await prisma.hopDongThue.findUnique({
      where: { idHopDong: parseInt(idHopDong) },
      include: {
        chiTiets: {
          include: { giuong: true }
        }
      }
    });

    if (!hopDong) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 2. TẠO BIÊN BẢN BÀN GIAO
      const bienBan = await tx.bienBanBanGiao.create({
        data: {
          idHopDong: parseInt(idHopDong),
          noiDung:   noiDung   || null,
          trangThai: trangThai || 'HOAN_TAT',
        },
      });

      // 3. LƯU CHI TIẾT TÀI SẢN (Nếu có)
      if (assets.length > 0) {
        await tx.chiTietBanGiao.createMany({
          data: assets.map((a) => ({
            idBienBan: bienBan.idBienBan,
            idTaiSan:  parseInt(a.idTaiSan),
            tinhTrang: a.tinhTrang || 'BINH_THUONG',
            hdSuDung:  a.hdSuDung  || null,
          })),
        });

        // Cập nhật tình trạng bên bảng TaiSan
        await Promise.all(
          assets.map((a) =>
            tx.taiSan.update({
              where: { idTaiSan: parseInt(a.idTaiSan) },
              data:  { tinhTrang: a.tinhTrang || 'BINH_THUONG' },
            })
          )
        );
      }

      // 4. 🛑 LOGIC MỚI: GIẢI PHÓNG GIƯỜNG (TRẢ TRẠNG THÁI VỀ AVAILABLE)
      if (hopDong.hinhThuc === 'NGUYEN_PHONG') {
        // Nếu lúc trước thuê nguyên phòng -> Mở khóa toàn bộ giường trong phòng đó
        const idPhong = hopDong.chiTiets[0]?.giuong?.idPhong;
        if (idPhong) {
          await tx.giuong.updateMany({
            where: { idPhong: parseInt(idPhong) },
            data: { trangThai: true } // true = Trống (Available)
          });
        }
      } else {
        // Nếu ở ghép -> Chỉ mở khóa đúng những giường mà khách này đã thuê
        const giuongIds = hopDong.chiTiets.map((ct) => ct.idGiuong).filter(id => id != null);
        if (giuongIds.length > 0) {
          await tx.giuong.updateMany({
            where: { idGiuong: { in: giuongIds } },
            data: { trangThai: true } // true = Trống (Available)
          });
        }
      }

      // 5. CẬP NHẬT TRẠNG THÁI HỢP ĐỒNG THÀNH "HẾT HẠN/THANH LÝ
      // Khách trả phòng rồi thì hợp đồng cũng phải đóng lại để chuẩn luồng dữ liệu
      await tx.hopDongThue.update({
        where: { idHopDong: parseInt(idHopDong) },
        data: { trangThai: 'HET_HAN' } 
      });

      // 6. Trả về kết quả
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
