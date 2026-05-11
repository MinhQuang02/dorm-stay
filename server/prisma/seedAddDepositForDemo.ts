// @ts-ignore
import { PrismaClient, PhuongThucThanhToan, TrangThaiThanhToan, HinhThucThue } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update these if different
  const accountId = 469; // idTaiKhoan

  // Find customer linked
  const customer = await prisma.khachHang.findFirst({ where: { idTaiKhoan: accountId } });
  if (!customer) throw new Error('Customer for account not found');

  // Find an available bed or use the demo bed
  const bed = await prisma.giuong.findFirst({ where: { idKhachHang: null }, take: 1 });
  if (!bed) throw new Error('No available bed found');

  // Create a deposit payment
  const payment = await prisma.ttoanDatCoc.create({
    data: {
      tienCoc: bed.giaGiuong * 2,
      tienDaTra: bed.giaGiuong * 2,
      phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN,
      trangThai: TrangThaiThanhToan.THANH_CONG
    }
  });

  await prisma.ttinDatCoc.create({
    data: {
      idThanhToan: payment.idThanhToan,
      idKhachHang: customer.idKhachHang,
      idGiuong: bed.idGiuong
    }
  });

  const invoice = await prisma.hoaDon.create({ data: { tienDaTra: payment.tienDaTra, chungTu: `DEMO_ADDDEP_${Date.now()}` } });
  await prisma.hoaDonDatCoc.create({ data: { idHoaDon: invoice.idHoaDon, idThanhToan: payment.idThanhToan } });

  // Create a simple contract and detail linking this customer and bed
  const phieu = await prisma.phieuYeuCau.create({ data: { hinhThucThue: HinhThucThue.O_GHEP, soNguoi: 1, loaiPhong: 'Contracted by seed' } });

  const hopDong = await prisma.hopDongThue.create({
    data: {
      idPhieu: phieu.idPhieu,
      idNguoiLap: 1,
      hinhThuc: HinhThucThue.O_GHEP,
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      trangThai: 'DANG_THUE',
      kyThanhToan: '1_THANG'
    }
  });

  await prisma.chiTietHopDongThue.create({ data: { idKhachHang: customer.idKhachHang, idHopDong: hopDong.idHopDong, idGiuong: bed.idGiuong } });

  console.log('Added deposit + contract for demo:');
  console.log({ accountId, customerId: customer.idKhachHang, bedId: bed.idGiuong, paymentId: payment.idThanhToan, invoiceId: invoice.idHoaDon, hopDongId: hopDong.idHopDong });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
