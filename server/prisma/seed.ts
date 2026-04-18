// @ts-ignore
import { 
  PrismaClient, HinhThucThue, LoaiNhanVien, TrangThaiLichHen, 
  TrangThaiSauHen, PhuongThucThanhToan, TrangThaiThanhToan, LoaiPhieuGhiCoc 
} from '@prisma/client';

declare var process: any;

const prisma = new PrismaClient();

// --- Data Generation Helpers ---
const hoItems = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Lý', 'Trịnh', 'Đinh'];
const demItems = ['Văn', 'Thị', 'Đức', 'Hữu', 'Ngọc', 'Minh', 'Xuân', 'Thu', 'Thủy', 'Đình', 'Hoài', 'Tiến', 'Bá'];
const tenItems = ['Hải', 'Sơn', 'Tùng', 'Hoa', 'Lan', 'Mai', 'Linh', 'Phong', 'An', 'Bình', 'Hường', 'Cường', 'Dũng', 'Trí', 'Tài', 'Khánh', 'Kiên', 'Hùng', 'Oanh'];

const getRandomName = () => `${randomElement(hoItems)} ${randomElement(demItems)} ${randomElement(tenItems)}`;
const getRandomPhone = () => '0' + randomInt(111111111, 999999999).toString();
const getRandomCCCD = () => '0' + randomInt(10000000000, 99999999999).toString();
function randomElement<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function cleanDB() {
  console.log('Cleaning up database tables...');
  await prisma.hoaDonCoc.deleteMany();
  await prisma.phieuGhiCocKhachHang.deleteMany();
  await prisma.baoCaoChiPhi.deleteMany();
  await prisma.banGhiChiPhi.deleteMany();
  await prisma.bienBanKiemTraPhong.deleteMany();
  await prisma.chiTietBanGiao.deleteMany();
  await prisma.bienBanBanGiao.deleteMany();
  await prisma.quanLyTaiSan.deleteMany();
  await prisma.taiSan.deleteMany();
  await prisma.hoaDonDinhKy.deleteMany();
  await prisma.ttoanDinhKy.deleteMany();
  await prisma.chiTietDichVuThue.deleteMany();
  await prisma.chiTietHopDongThue.deleteMany();
  await prisma.hopDongThue.deleteMany();
  await prisma.hoaDonDatCoc.deleteMany();
  await prisma.hoaDon.deleteMany();
  await prisma.ttinDatCoc.deleteMany();
  await prisma.ttoanDatCoc.deleteMany();
  await prisma.ctLuuTru.deleteMany();
  await prisma.dieuKienLuuTru.deleteMany();
  await prisma.ctQuyDinh.deleteMany();
  await prisma.quyDinh.deleteMany();
  await prisma.giuong.deleteMany();
  await prisma.phong.deleteMany();
  await prisma.lichXemPhong.deleteMany();
  await prisma.lichSuTaoPhieu.deleteMany();
  await prisma.khachHang.deleteMany();
  await prisma.taiKhoan.deleteMany();
  await prisma.phieuYeuCau.deleteMany();
  await prisma.dichVu.deleteMany();
  await prisma.nhanVien.deleteMany();
}

async function main() {
  console.log('Bắt đầu khởi tạo MỌI BẢNG với KHỐI LƯỢNG LỚN (Massive Seeding)...');

  await cleanDB();

  // 1. NHÂN VIÊN: 50 người
  console.log('Seeding Staff... (50 records)');
  const nhanViens: any[] = [];
  for (let i = 1; i <= 50; i++) {
    const isQuanLy = i <= 15;
    nhanViens.push(await prisma.nhanVien.create({
      data: {
        hoTen: getRandomName(), gioiTinh: randomElement(['Nam', 'Nữ']),
        sdt: getRandomPhone(), email: `staff_huge_${i}@dormstay.local`, cccd: getRandomCCCD() + i,
        loai: isQuanLy ? LoaiNhanVien.QUAN_LY : LoaiNhanVien.SALE, trangThai: true,
      }
    }));
  }
  const quanLys = nhanViens.filter(nv => nv.loai === LoaiNhanVien.QUAN_LY);
  const sales = nhanViens.filter(nv => nv.loai === LoaiNhanVien.SALE);

  // 2. DỊCH VỤ, QUY ĐỊNH, ĐIỀU KIỆN LƯU TRÚ
  console.log('Seeding Rules, Services & Conditions... (Dozens of records)');
  const dichVus: any[] = [];
  for (let i=1; i<=25; i++) {
    dichVus.push({ tenDichVu: `Dịch vụ mở rộng ${i} (Giặt/Gửi xe/Internet/v.v)`, donGia: randomInt(1, 50) * 10000 });
  }
  const createdDichVus = await Promise.all(dichVus.map(d => prisma.dichVu.create({ data: d })));
  
  const quyDinhs: any[] = [];
  for (let i=1; i<=30; i++) {
    quyDinhs.push({ noiDung: `Nội quy số ${i} về sinh hoạt an toàn trật tự`, idQLQD: randomElement(quanLys).idNhanVien });
  }
  const createdQDs = await Promise.all(quyDinhs.map(q => prisma.quyDinh.create({ data: q })));
  
  const dkLuuTrus: any[] = [];
  for (let i=1; i<=20; i++) {
    dkLuuTrus.push({ tenDieuKien: `Điều kiện pháp lý mã số LT-${i}`, moTa: 'Quy chuẩn lưu trú chung' });
  }
  const createdDKLTs = await Promise.all(dkLuuTrus.map(d => prisma.dieuKienLuuTru.create({ data: d })));

  // 3. TÀI SẢN (100 tài sản)
  console.log('Seeding Assets... (100 records)');
  const taiSans: any[] = [];
  for (let i = 1; i <= 100; i++) {
    taiSans.push(await prisma.taiSan.create({
      data: {
        tenTaiSan: randomElement(['Máy lạnh', 'Tủ lạnh', 'TV', 'Tủ quần áo', 'Máy quạt', 'Ghế đa năng', 'Bàn vi tính', 'Giường đệm']) + ` (Mã TS-${i})`,
        loaiTaiSan: randomElement(['Điện tử', 'Đồ gỗ', 'Phụ kiện']), 
        ngayMua: randomDate(new Date('2021-01-01'), new Date('2023-12-31')),
        tinhTrang: randomElement(['Mới 100%', 'Hoạt động tốt', 'Khấu hao 20%']), 
        giaMua: randomInt(5, 50) * 100000,
      }
    }));
  }

  // 4. MẠNG LƯỚI PHÒNG, GIƯỜNG VÀ CT (PHỤ KIỆN PHÒNG) - 100 Phòng
  console.log('Seeding Rooms & Beds... (100 Phòng, ~300 Giường)');
  const phongs: any[] = []; const giuongs: any[] = [];
  for (let i = 1; i <= 100; i++) {
    const ql = randomElement(quanLys);
    const phong = await prisma.phong.create({
      data: {
        idQuanLy: ql.idNhanVien, loaiPhong: `Phòng ${randomElement(['Master', 'Standard', 'VIP', 'Deluxe'])} tầng ${randomInt(1,10)}`,
        sucChua: randomElement([2, 4, 6]), trangThai: 'TRONG', chiPhiDienNuoc: randomInt(3, 8) * 100000,
      }
    });
    phongs.push(phong);
    
    // Connect mapping rules (Dùng index cố định hoặc trộn nhưng lấy 2 phần tử khác nhau)
    const rule1 = createdQDs[0];
    const rule2 = createdQDs[1];
    
    await prisma.ctQuyDinh.create({ data: { idPhong: phong.idPhong, idQuyDinh: rule1.idQuyDinh } });
    if(rule2) await prisma.ctQuyDinh.create({ data: { idPhong: phong.idPhong, idQuyDinh: rule2.idQuyDinh } });
    
    await prisma.ctLuuTru.create({ data: { idPhong: phong.idPhong, idDieuKien: (randomElement(createdDKLTs) as any).idDieuKien } });
    
    // Distribute Assets to Room
    const ts1 = taiSans[i % taiSans.length];
    const ts2 = taiSans[(i+1) % taiSans.length];
    
    try { await prisma.quanLyTaiSan.create({ data: { idPhong: phong.idPhong, idTaiSan: ts1.idTaiSan, ghiChu: 'Bố trí cố định' } }); } catch (e: any) {}
    try { await prisma.quanLyTaiSan.create({ data: { idPhong: phong.idPhong, idTaiSan: ts2.idTaiSan, ghiChu: 'Bố trí di động' } }); } catch (e: any) {}

    for (let j = 1; j <= phong.sucChua; j++) {
      giuongs.push(await prisma.giuong.create({ data: { idPhong: phong.idPhong, viTri: `Giường số ${j}`, giaGiuong: randomInt(15, 30) * 100000, trangThai: true } }));
    }
  }

  // 5. TÀI KHOẢN VÀ KHÁCH HÀNG (200 Khách hàng & 200 Tài khoản tương ứng)
  console.log('Seeding Customers and Accounts... (200 records)');
  const khachHangs: any[] = [];
  for (let i = 1; i <= 200; i++) {
    const tk = await prisma.taiKhoan.create({
      data: { taiKhoan: `master_user_${i}`, matKhau: `hashed_pwd_huge_${i}`, email: `user_vip_${i}@demo.mail` }
    });
    const kh = await prisma.khachHang.create({
      data: {
        hoTen: getRandomName(), sdt: getRandomPhone(), email: tk.email,
        gioiTinh: randomElement(['Nam', 'Nữ']), ngaySinh: randomDate(new Date('1998-01-01'), new Date('2005-01-01')),
        cccd: getRandomCCCD() + i, quocTich: 'VN', idTaiKhoan: tk.idTaiKhoan,
      }
    });
    khachHangs.push({ ...kh, taiKhoan: tk });
  }

  // 6. LUỒNG NGHIỆP VỤ LIÊN TỤC: (200 Phiếu/Hợp Đồng/Hóa đơn)
  console.log('Seeding Core Business Logic (Contracts, Invoices, Checks, Deposit Returns)... (Hundreds of records)');
  let giuongCursor = 0;

  for (let k = 0; k < 200; k++) {
    const khach = randomElement(khachHangs);
    const sale = randomElement(sales);

    // 6.1 Tạo Phiếu và Lịch
    const phieu = await prisma.phieuYeuCau.create({
      data: { hinhThucThue: HinhThucThue.O_GHEP, soNguoi: 1, khuVucMongMuon: 'Cơ sở chính Quận 1', loaiPhong: 'Tiêu chuẩn', taiKhoanMoiNhat: { connect: { idTaiKhoan: khach.idTaiKhoan! } } }
    });
    
    await prisma.lichSuTaoPhieu.create({ data: { idPhieu: phieu.idPhieu, idTaiKhoan: khach.idTaiKhoan! } });
    
    // Tạo 1 hoặc nhiều lịch hẹn
    await prisma.lichXemPhong.create({
      data: { idPhieu: phieu.idPhieu, thoiGianHen: randomDate(new Date('2023-01-01'), new Date('2024-01-01')), diaDiem: 'Văn phòng Lễ tân', ttLichHen: TrangThaiLichHen.DA_XEM, ttSauHen: TrangThaiSauHen.DAT_COC }
    });

    const giuongCoc = giuongs[giuongCursor++]; 
    if(giuongCursor >= giuongs.length) giuongCursor = 0;

    // 6.2 Thanh toán Đặt Cọc
    const ttoanCoc = await prisma.ttoanDatCoc.create({
      data: { tienCoc: randomInt(10, 20) * 100000, tienDaTra: randomInt(10, 20) * 100000, phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN, trangThai: TrangThaiThanhToan.THANH_CONG }
    });
    await prisma.ttinDatCoc.create({ data: { idThanhToan: ttoanCoc.idThanhToan, idKhachHang: khach.idKhachHang, idGiuong: giuongCoc.idGiuong } });

    const hdCoc = await prisma.hoaDon.create({ data: { tienDaTra: ttoanCoc.tienDaTra, chungTu: `CT_COC_MASS_${k}` } });
    await prisma.hoaDonDatCoc.create({ data: { idHoaDon: hdCoc.idHoaDon, idThanhToan: ttoanCoc.idThanhToan } });

    // 6.3 Hợp Đồng Thue
    const hdStartDate = randomDate(new Date('2024-02-01'), new Date('2024-07-01'));
    const hopDong = await prisma.hopDongThue.create({
      data: {
        idPhieu: phieu.idPhieu, idNguoiLap: sale.idNhanVien, hinhThuc: HinhThucThue.O_GHEP,
        ngayBatDau: hdStartDate, ngayKetThuc: new Date(hdStartDate.getTime() + randomElement([3, 6, 12]) * 30 * 24 * 60 * 60 * 1000), trangThai: 'DANG_THUE', kyThanhToan: '1_THANG'
      }
    });

    await prisma.chiTietHopDongThue.create({ data: { idKhachHang: khach.idKhachHang, idHopDong: hopDong.idHopDong, idGiuong: giuongCoc.idGiuong, thongTinCT: 'Chủ thể hợp đồng' } });
    
    // Gắn 2 dịch vụ mỗi hợp đồng
    const dv1 = createdDichVus[0];
    const dv2 = createdDichVus[1];
    await prisma.chiTietDichVuThue.create({ data: { idDichVu: dv1.idDichVu, idHopDong: hopDong.idHopDong } });
    await prisma.chiTietDichVuThue.create({ data: { idDichVu: dv2.idDichVu, idHopDong: hopDong.idHopDong } });

    // 6.4 Thanh toán định kỳ (Mỗi hợp đồng 3 đợt thanh toán -> 600 dòng Hóa Đơn Định Kỳ)
    for(let dot=1; dot<=3; dot++) {
      const thoiGianTT = new Date(hdStartDate.getTime() + dot * 30 * 24 * 60 * 60 * 1000);
      const tDinhKy = await prisma.ttoanDinhKy.create({
        data: { idHopDong: hopDong.idHopDong, thoiGianTT: thoiGianTT, tienThanhToan: randomInt(20, 50) * 100000, kyThanhToan: `Kỳ phí T${dot}`, phuongThuc: PhuongThucThanhToan.TIEN_MAT }
      });
      const hdBaseDK = await prisma.hoaDon.create({ data: { tienDaTra: tDinhKy.tienThanhToan, chungTu: `HD_DINHKY_${hopDong.idHopDong}_T${dot}` } });
      await prisma.hoaDonDinhKy.create({ data: { idHoaDon: hdBaseDK.idHoaDon, idHopDong: hopDong.idHopDong, thoiGianTT: thoiGianTT } });
    }

    // 6.5 Bàn giao tài sản 
    const bbBanGiao = await prisma.bienBanBanGiao.create({
      data: { idHopDong: hopDong.idHopDong, noiDung: 'Biên bản nhận phòng standard', trangThai: 'DA_KY' }
    });
    // Record 2 tài sản được bàn giao
    const ts1 = taiSans[k % taiSans.length];
    const ts2 = taiSans[(k+1) % taiSans.length];
    
    await prisma.chiTietBanGiao.create({ data: { idBienBan: bbBanGiao.idBienBan, idTaiSan: ts1.idTaiSan, tinhTrang: 'Chạy tốt', hdSuDung: 'Bật cầu dao trước' } });
    await prisma.chiTietBanGiao.create({ data: { idBienBan: bbBanGiao.idBienBan, idTaiSan: ts2.idTaiSan, tinhTrang: '100%', hdSuDung: 'Không tự ý tháo dỡ' } });

    // 6.6 Biên bản kiểm tra phòng 
    const bbKiemTra = await prisma.bienBanKiemTraPhong.create({
      data: {
        idNguoiKiemTra: randomElement(quanLys).idNhanVien, idHopDong: hopDong.idHopDong, idPhong: giuongCoc.idPhong,
        tenBienBan: `Kiểm tra K-Q${randomInt(1, 4)}`,
        ngayKiemTra: new Date(hdStartDate.getTime() + randomInt(10, 40) * 24 * 60 * 60 * 1000), 
        tinhTrang: randomElement(['Tốt', 'Khá', 'Cần sửa chữa']), noiDung: 'Duyệt theo chuẩn ISO quản lý'
      }
    });

    // 6.7 BanGhiChiPhi -> PhieuGhiCocKhachHang -> BaoCaoChiPhi -> HoaDonCoc
    // Sinh tỉ lệ rủi ro (70% các hợp đồng sẽ có ghi có/nợ cọc) để đôn số liệu
    if (k % 2 === 0 || k % 3 === 0) { 
      const amount = randomInt(5, 15) * 100000;
      const banGhiCp = await prisma.banGhiChiPhi.create({
        data: {
          idHopDong: hopDong.idHopDong, idKhachHang: khach.idKhachHang, ngayKiemTra: bbKiemTra.ngayKiemTra,
          tienCanTra: amount, noiDung: randomElement(['Hoàn tiền cọc do trả phòng đúng hạn', 'Trừ tiền cọc do làm hỏng tủ', 'Truy thu do nợ phí điện'])
        }
      });
      // Phiếu ghi cọc khách
      const pgType = randomElement([LoaiPhieuGhiCoc.GHI_NO, LoaiPhieuGhiCoc.GHI_HOAN, LoaiPhieuGhiCoc.THONG_THUONG]);
      await prisma.phieuGhiCocKhachHang.create({ data: { idBanGhiCP: banGhiCp.idBanGhiCP, tienThucTe: amount, loaiPhieu: pgType } });
      
      // Báo cáo chi phí (Nợ khoản này) -> Hóa đơn cọc
      const baoCaoCp = await prisma.baoCaoChiPhi.create({ data: { idHopDong: hopDong.idHopDong, soTien: amount, noHayHoan: pgType === 'GHI_NO' ? 'NO' : 'HOAN'} });
      // Record to HoaDon
      const hdFinal = await prisma.hoaDon.create({ data: { tienDaTra: amount, chungTu: `THU_CHI_COC_${banGhiCp.idBanGhiCP}` } });
      await prisma.hoaDonCoc.create({ data: { idBaoCao: baoCaoCp.idBaoCao, idHoaDon: hdFinal.idHoaDon } });
    }
  }

  console.log('Toàn bộ thao tác Seeding MASS KHỔNG LỒ (Tất cả bàn của DB) đã hoàn thiện.');
}

main().then(async () => { await prisma.$disconnect(); }).catch(async (e: any) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
