const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu khởi tạo dữ liệu mẫu (Seeding)...');

  // 1. Tạo một tài khoản hệ thống mẫu
  const taiKhoanAdmin = await prisma.taiKhoan.upsert({
    where: { taiKhoan: 'admin' },
    update: {},
    create: {
      taiKhoan: 'admin',
      matKhau: '$2b$10$Ep...Hash...Sample', // Thường là hash password bằng bcrypt
      email: 'admin@dormstay.local',
      ngaySinh: new Date('1990-01-01'),
    },
  });
  console.log(`Đã tạo tài khoản: ${taiKhoanAdmin.taiKhoan}`);

  // 2. Tạo nhân viên quản lý
  const nhanVienQL = await prisma.nhanVien.upsert({
    where: { email: 'quanly@dormstay.local' },
    update: {},
    create: {
      hoTen: 'Nguyễn Văn Quản Lý',
      gioiTinh: 'Nam',
      sdt: '0987654321',
      email: 'quanly@dormstay.local',
      cccd: '001201012345',
      loai: 'QUAN_LY',
      trangThai: true,
    },
  });
  console.log(`Đã tạo nhân viên quản lý: ${nhanVienQL.hoTen}`);

  // 3. Tạo nhân viên Sale
  const nhanVienSale = await prisma.nhanVien.upsert({
    where: { email: 'sale@dormstay.local' },
    update: {},
    create: {
      hoTen: 'Trần Thị Sale',
      gioiTinh: 'Nữ',
      sdt: '0912345678',
      email: 'sale@dormstay.local',
      cccd: '001202054321',
      loai: 'SALE',
      trangThai: true,
    },
  });
  console.log(`Đã tạo nhân viên sale: ${nhanVienSale.hoTen}`);

  // 4. Tạo phòng và giường
  // Tạo phòng 1
  const phong1 = await prisma.phong.create({
    data: {
      idQuanLy: nhanVienQL.idNhanVien,
      loaiPhong: 'Phòng VIP 2 người',
      sucChua: 2,
      trangThai: 'TRONG',
      chiPhiDienNuoc: 500000,
      dichVuDiKem: 'Dọn dẹp 1 lần/tuần',
      giuongs: {
        create: [
          { viTri: 'Trái', giaGiuong: 2500000, trangThai: true },
          { viTri: 'Phải', giaGiuong: 2500000, trangThai: true },
        ],
      },
    },
  });
  console.log(`Đã tạo phòng: ${phong1.loaiPhong} với ID: ${phong1.idPhong}`);

  // 5. Tạo các dịch vụ mẫu
  const dichVuDonDep = await prisma.dichVu.create({
    data: { tenDichVu: 'Dọn dẹp phòng', donGia: 100000 },
  });
  const dichVuGiatUi = await prisma.dichVu.create({
    data: { tenDichVu: 'Giặt ủi (kg)', donGia: 20000 },
  });
  console.log(`Đã tạo dịch vụ: ${dichVuDonDep.tenDichVu}, ${dichVuGiatUi.tenDichVu}`);

  // 6. Tạo một khách hàng gắn với tài khoản đã tạo ở Bước 1
  const khachHang1 = await prisma.khachHang.upsert({
    where: { cccd: '001203099888' },
    update: {},
    create: {
      hoTen: 'Khách Hàng Một',
      sdt: '0999888777',
      email: 'khachhang1@dormstay.local',
      gioiTinh: 'Nam',
      cccd: '001203099888',
      quocTich: 'Việt Nam',
      idTaiKhoan: taiKhoanAdmin.idTaiKhoan,
    },
  });
  console.log(`Đã tạo khách hàng mẫu: ${khachHang1.hoTen}`);

  console.log('Seeding đã hoàn tất thành công!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
