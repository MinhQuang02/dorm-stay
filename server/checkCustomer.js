const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Tìm tất cả khách hàng
    const allCustomers = await prisma.khachHang.findMany({ take: 10 });
    console.log('=== Tất cả khách hàng (10 bản ghi đầu tiên) ===');
    console.log(JSON.stringify(allCustomers, null, 2));

    // Tìm khách hàng theo hoTen
    const byName = await prisma.khachHang.findFirst({
      where: { hoTen: 'Dương Đức Thịnh' }
    });
    console.log('\n=== Tìm theo hoTen: Dương Đức Thịnh ===');
    console.log(JSON.stringify(byName, null, 2));

    // Tìm khách hàng theo sdt
    const byPhone = await prisma.khachHang.findFirst({
      where: { sdt: '091234565' }
    });
    console.log('\n=== Tìm theo sdt: 091234565 ===');
    console.log(JSON.stringify(byPhone, null, 2));

    // Tìm khách hàng theo hoTen + sdt
    const byNamePhone = await prisma.khachHang.findFirst({
      where: {
        hoTen: 'Dương Đức Thịnh',
        sdt: '091234565'
      }
    });
    console.log('\n=== Tìm theo hoTen + sdt ===');
    console.log(JSON.stringify(byNamePhone, null, 2));

    // Đếm tổng số khách hàng
    const count = await prisma.khachHang.count();
    console.log(`\n=== Tổng số khách hàng: ${count} ===`);

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
