// @ts-ignore
import { PrismaClient, HinhThucThue, PhuongThucThanhToan, TrangThaiThanhToan, LoaiPhieuGhiCoc } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TARGET_ACCOUNT_ID = 464;

  console.log(`Bắt đầu chạy kịch bản tạo dữ liệu HOÀN THIỆN ĐA KẾT NỐI cho idTaiKhoan = ${TARGET_ACCOUNT_ID}...`);

  // 1. Tạo/Tìm Tài Khoản
  let taiKhoan = await prisma.taiKhoan.findUnique({ where: { idTaiKhoan: TARGET_ACCOUNT_ID } });
  if (!taiKhoan) {
    taiKhoan = await prisma.taiKhoan.create({
      data: {
        idTaiKhoan: TARGET_ACCOUNT_ID,
        taiKhoan: `test_user_vip_${TARGET_ACCOUNT_ID}`,
        matKhau: 'password123',
        email: `test_full_${TARGET_ACCOUNT_ID}@dormstay.local`
      }
    });
  }

  // 2. Tạo/Tìm Khách Hàng (Customer)
  let khachHang = await prisma.khachHang.findUnique({ where: { idTaiKhoan: TARGET_ACCOUNT_ID } });
  if (!khachHang) {
    khachHang = await prisma.khachHang.create({
      data: {
        hoTen: 'Người Dùng Sinh Viên VIP',
        sdt: '0909090909',
        email: taiKhoan.email,
        cccd: "0" + Math.floor(Math.random() * 10000000000),
        idTaiKhoan: taiKhoan.idTaiKhoan,
        gioiTinh: 'Nam',
        quocTich: 'VN'
      }
    });
  }

  // Lấy hoặc tạo Nhân viên Sale / Quản lý
  let nhanVienSale = await prisma.nhanVien.findFirst({ where: { loai: 'SALE' } });
  if(!nhanVienSale) nhanVienSale = await prisma.nhanVien.create({ data: { hoTen: 'Sale Master', sdt: '0231', email: 'sale1@x.x', cccd: '21392', loai: 'SALE' } });
  
  let nhanVienQL = await prisma.nhanVien.findFirst({ where: { loai: 'QUAN_LY' } });
  if(!nhanVienQL) nhanVienQL = await prisma.nhanVien.create({ data: { hoTen: 'QL Nhóm', sdt: '02312', email: 'ql@x.x', cccd: '2139212', loai: 'QUAN_LY' } });

  // 3. Tạo Dịch vụ mở rộng & Tài Sản & Quy Định
  const dichVu = await prisma.dichVu.create({ data: { tenDichVu: 'Giặt ủi tháng', donGia: 300000 } });
  const taiSan = await prisma.taiSan.create({ data: { tenTaiSan: 'Máy Giặt', loaiTaiSan: 'Điện máy', tinhTrang: 'Tốt' } });
  const quyDinh = await prisma.quyDinh.create({ data: { noiDung: 'Không vứt rác ở hành lang', idQLQD: nhanVienQL.idNhanVien } });
  const dieuKien = await prisma.dieuKienLuuTru.create({ data: { tenDieuKien: 'ĐKKT 01', moTa: 'Không tiền án' } });

  // 4. Tạo Phòng tiêu chuẩn và Giường
  const phong = await prisma.phong.create({
    data: {
      loaiPhong: 'Room VIP Cao cấp', 
      sucChua: 2, 
      trangThai: 'DA_THUE', 
      idQuanLy: nhanVienQL.idNhanVien,
      chiPhiDienNuoc: 200000
    }
  });

  // Liên kết Phòng với hệ sinh thái
  await prisma.ctQuyDinh.create({ data: { idPhong: phong.idPhong, idQuyDinh: quyDinh.idQuyDinh } });
  await prisma.ctLuuTru.create({ data: { idPhong: phong.idPhong, idDieuKien: dieuKien.idDieuKien } });
  await prisma.quanLyTaiSan.create({ data: { idPhong: phong.idPhong, idTaiSan: taiSan.idTaiSan, ghiChu: 'Đặt trong phòng' } });

  // Giường của Khách hàng
  const giuong = await prisma.giuong.create({
    data: {
      idPhong: phong.idPhong,
      viTri: 'Giường 01 Cận Ban Công',
      giaGiuong: 3500000,
      trangThai: false, // đã thuê
      idKhachHang: khachHang.idKhachHang
    }
  });

  // 5. Phiếu yêu cầu & Lịch hẹn
  const phieu = await prisma.phieuYeuCau.create({
    data: {
      hinhThucThue: HinhThucThue.O_GHEP,
      soNguoi: 1,
      loaiPhong: phong.loaiPhong,
      taiKhoanMoiNhat: { connect: { idTaiKhoan: taiKhoan.idTaiKhoan } }, // Nối trực tiếp TaiKhoan.phieuMoiNhatId
      giaMongMuon: 3000000
    }
  });

  // Cập nhật ngược Khách Hàng => PhieuYeuCau (Bổ sung kết nối logic nếu DB yêu cầu query đa chiều)
  await prisma.khachHang.update({
    where: { idKhachHang: khachHang.idKhachHang },
    data: { phieuYeuCauId: phieu.idPhieu }
  });

  await prisma.lichSuTaoPhieu.create({
    data: { idPhieu: phieu.idPhieu, idTaiKhoan: taiKhoan.idTaiKhoan }
  });

  await prisma.lichXemPhong.create({
    data: { idPhieu: phieu.idPhieu, thoiGianHen: new Date(), diaDiem: 'KTX Trung tâm', ttLichHen: 'DA_XEM', ttSauHen: 'DAT_COC' }
  });

  // 6. Thanh Toán Khoản Cọc (TtoanDatCoc + TtinDatCoc + HoaDonDatCoc)
  const ttoanCoc = await prisma.ttoanDatCoc.create({
    data: {
      tienCoc: 2000000,
      tienDaTra: 10000000, 
      phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN,
      trangThai: TrangThaiThanhToan.THANH_CONG
    }
  });
  await prisma.ttinDatCoc.create({ data: { idThanhToan: ttoanCoc.idThanhToan, idKhachHang: khachHang.idKhachHang, idGiuong: giuong.idGiuong } });
  
  const hdBascCoc = await prisma.hoaDon.create({ data: { tienDaTra: 10000000, chungTu: 'UNC_COC_464' } });
  await prisma.hoaDonDatCoc.create({ data: { idHoaDon: hdBascCoc.idHoaDon, idThanhToan: ttoanCoc.idThanhToan } });

  // 7. Tạo Hợp Đồng Thuê (Toàn quyền)
  const now = new Date();
  const hopDong = await prisma.hopDongThue.create({
    data: {
      idPhieu: phieu.idPhieu,
      idNguoiLap: nhanVienSale.idNhanVien,
      hinhThuc: HinhThucThue.O_GHEP,
      ngayBatDau: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)), // Ở được 3 tháng
      ngayKetThuc: new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)), // Còn 1 năm
      trangThai: 'DANG_THUE',
      kyThanhToan: '1_THANG'
    }
  });

  await prisma.chiTietHopDongThue.create({
    data: { idKhachHang: khachHang.idKhachHang, idHopDong: hopDong.idHopDong, idGiuong: giuong.idGiuong, thongTinCT: 'Chủ HĐ Test 464' }
  });
  
  // Dịch vụ thuê
  await prisma.chiTietDichVuThue.create({
    data: { idHopDong: hopDong.idHopDong, idDichVu: dichVu.idDichVu }
  });

  // 8. Đăng ký Biên bản bàn giao tài sản khi vào HĐ
  const bbBanGiao = await prisma.bienBanBanGiao.create({
    data: { idHopDong: hopDong.idHopDong, noiDung: 'Giao full đồ', trangThai: 'DA_KY' }
  });
  await prisma.chiTietBanGiao.create({ data: { idBienBan: bbBanGiao.idBienBan, idTaiSan: taiSan.idTaiSan, tinhTrang: 'Còn Mới' } });

  // 9. Sinh Thanh Toán Phí Sinh Hoạt Định Kỳ & Hóa Đơn Định Kỳ
  const ttoanDinhKy = await prisma.ttoanDinhKy.create({
    data: {
      idHopDong: hopDong.idHopDong,
      thoiGianTT: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
      tienThanhToan: 3800000,
      tienConThieu: 700000, // Nợ hóa đơn 700k
      phuongThuc: PhuongThucThanhToan.TIEN_MAT,
      kyThanhToan: "Kỳ phí lưu trú + Dịch Vụ Máng T11"
    }
  });
  const hdBascDK = await prisma.hoaDon.create({ data: { tienDaTra: 3100000, chungTu: 'UNC_DK_464' } });
  await prisma.hoaDonDinhKy.create({ data: { idHoaDon: hdBascDK.idHoaDon, idHopDong: hopDong.idHopDong, thoiGianTT: ttoanDinhKy.thoiGianTT } });

  // 10. Tạo Biên bản kiểm tra phòng (Quản lý thu nhận sát hạch) => Bản Ghi Chi Phí
  const bbKiemTra = await prisma.bienBanKiemTraPhong.create({
    data: {
      idNguoiKiemTra: nhanVienQL.idNhanVien,
      idPhong: phong.idPhong,
      idHopDong: hopDong.idHopDong,
      tenBienBan: 'Kiểm Tra Vỡ Bàn Test 464',
      tinhTrang: 'Co Hu Hai',
      noiDung: 'Làm hỏng tài sản'
    }
  });
  
  const banGhiCp = await prisma.banGhiChiPhi.create({
    data: {
      idHopDong: hopDong.idHopDong,
      idKhachHang: khachHang.idKhachHang,
      tienCanTra: 2000000,
      noiDung: "Đền bù do gây xước / hỏng đèn"
    }
  });
  
  // Ràng buộc PhieuGhiCoc (Debt Ticket) & BaoCaoChiPhi
  await prisma.phieuGhiCocKhachHang.create({
    data: { idBanGhiCP: banGhiCp.idBanGhiCP, tienThucTe: 2000000, loaiPhieu: LoaiPhieuGhiCoc.GHI_NO }
  });

  const baoCao = await prisma.baoCaoChiPhi.create({
    data: { idHopDong: hopDong.idHopDong, soTien: 2000000, noHayHoan: 'NO' }
  });
  const hdBascRp = await prisma.hoaDon.create({ data: { tienDaTra: 0, chungTu: 'PHAT_BGBP_464' } });
  await prisma.hoaDonCoc.create({ data: { idHoaDon: hdBascRp.idHoaDon, idBaoCao: baoCao.idBaoCao } });

  console.log(`================ HOÀN TẤT TẠO VÀ LIÊN KẾT CHÉO ================`);
  console.log(`Tiến trình cấy ghép siêu dữ liệu (31 bảng liên đới) đã kết nối trực tiếp vào idTaiKhoan=464 thành công xuất sắc!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // @ts-ignore
    process.exit(1);
  });
