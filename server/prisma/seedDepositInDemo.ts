// @ts-ignore
import { PrismaClient, HinhThucThue, TrangThaiLichHen, TrangThaiSauHen } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEST_ACCOUNT = {
  username: 'demo_deposit_user',
  email: 'deposit.demo@dormstay.local',
  password: 'Demo@12345'
};

const DEMO_ROOM_TYPE = 'DEMO_DEPOSIT_ROOM';
const DEMO_BED_POSITION = 'DEMO_BED_A1';

async function ensureManager() {
  let manager = await prisma.nhanVien.findFirst({
    where: { email: 'manager.deposit.demo@dormstay.local' }
  });

  if (!manager) {
    manager = await prisma.nhanVien.create({
      data: {
        hoTen: 'Manager Deposit Demo',
        sdt: '0900001000',
        email: 'manager.deposit.demo@dormstay.local',
        cccd: '999990001111',
        loai: 'QUAN_LY'
      }
    });
  }

  return manager;
}

async function ensureRoomAndBed(managerId, customerId) {
  let room = await prisma.phong.findFirst({
    where: { loaiPhong: DEMO_ROOM_TYPE }
  });

  if (!room) {
    room = await prisma.phong.create({
      data: {
        idQuanLy: managerId,
        loaiPhong: DEMO_ROOM_TYPE,
        sucChua: 4,
        trangThai: 'TRONG',
        chiPhiDienNuoc: 150000
      }
    });
  }

  let bed = await prisma.giuong.findFirst({
    where: {
      idPhong: room.idPhong,
      viTri: DEMO_BED_POSITION
    }
  });

  if (!bed) {
    bed = await prisma.giuong.create({
      data: {
        idPhong: room.idPhong,
        viTri: DEMO_BED_POSITION,
        giaGiuong: 2500000,
        trangThai: true,
        idKhachHang: null
      }
    });
  } else {
    // Force bed to available so deposit-in flow can be tested repeatedly.
    bed = await prisma.giuong.update({
      where: { idGiuong: bed.idGiuong },
      data: {
        giaGiuong: 2500000,
        trangThai: true,
        idKhachHang: null
      }
    });
  }

  return { room, bed };
}

async function ensureRequestAndSchedule(accountId, customerId, roomType) {
  let account = await prisma.taiKhoan.findUnique({ where: { idTaiKhoan: accountId } });
  let request = null;

  if (account?.phieuMoiNhatId) {
    request = await prisma.phieuYeuCau.findUnique({
      where: { idPhieu: account.phieuMoiNhatId }
    });
  }

  if (!request) {
    request = await prisma.phieuYeuCau.create({
      data: {
        hinhThucThue: HinhThucThue.O_GHEP,
        soNguoi: 1,
        loaiPhong: roomType,
        khuVucMongMuon: 'Demo District',
        giaMongMuon: 2500000
      }
    });
  } else {
    request = await prisma.phieuYeuCau.update({
      where: { idPhieu: request.idPhieu },
      data: {
        hinhThucThue: HinhThucThue.O_GHEP,
        soNguoi: 1,
        loaiPhong: roomType,
        khuVucMongMuon: 'Demo District',
        giaMongMuon: 2500000
      }
    });
  }

  await prisma.taiKhoan.update({
    where: { idTaiKhoan: accountId },
    data: { phieuMoiNhatId: request.idPhieu }
  });

  await prisma.khachHang.update({
    where: { idKhachHang: customerId },
    data: { phieuYeuCauId: request.idPhieu }
  });

  const latestSchedule = await prisma.lichXemPhong.findFirst({
    where: { idPhieu: request.idPhieu },
    orderBy: { idLichHen: 'desc' }
  });

  if (!latestSchedule) {
    await prisma.lichXemPhong.create({
      data: {
        idPhieu: request.idPhieu,
        thoiGianHen: new Date(),
        diaDiem: 'DormStay Demo',
        ttLichHen: TrangThaiLichHen.DA_XEM,
        ttSauHen: TrangThaiSauHen.CHUA_QUYET_DINH
      }
    });
  } else {
    await prisma.lichXemPhong.update({
      where: { idLichHen: latestSchedule.idLichHen },
      data: {
        ttLichHen: TrangThaiLichHen.DA_XEM,
        ttSauHen: TrangThaiSauHen.CHUA_QUYET_DINH
      }
    });
  }

  return request;
}

async function main() {
  const passwordHash = await bcrypt.hash(TEST_ACCOUNT.password, 10);

  const account = await prisma.taiKhoan.upsert({
    where: { email: TEST_ACCOUNT.email },
    update: {
      taiKhoan: TEST_ACCOUNT.username,
      matKhau: passwordHash
    },
    create: {
      taiKhoan: TEST_ACCOUNT.username,
      matKhau: passwordHash,
      email: TEST_ACCOUNT.email
    }
  });

  const customer = await prisma.khachHang.upsert({
    where: { idTaiKhoan: account.idTaiKhoan },
    update: {
      hoTen: 'Demo Deposit Customer',
      sdt: '0900000464',
      email: TEST_ACCOUNT.email,
      gioiTinh: 'Nam',
      quocTich: 'VN'
    },
    create: {
      hoTen: 'Demo Deposit Customer',
      sdt: '0900000464',
      email: TEST_ACCOUNT.email,
      gioiTinh: 'Nam',
      quocTich: 'VN',
      cccd: `464${Date.now().toString().slice(-8)}`,
      idTaiKhoan: account.idTaiKhoan
    }
  });

  const manager = await ensureManager();
  const { room, bed } = await ensureRoomAndBed(manager.idNhanVien, customer.idKhachHang);
  const request = await ensureRequestAndSchedule(account.idTaiKhoan, customer.idKhachHang, room.loaiPhong);

  console.log('=== Deposit Demo Seed Ready ===');
  console.log(`Login email: ${TEST_ACCOUNT.email}`);
  console.log(`Login password: ${TEST_ACCOUNT.password}`);
  console.log(`userId (idTaiKhoan): ${account.idTaiKhoan}`);
  console.log(`customerId: ${customer.idKhachHang}`);
  console.log(`roomId: ${room.idPhong}`);
  console.log(`bedId: ${bed.idGiuong}`);
  console.log(`requestId: ${request.idPhieu}`);
  console.log('Use these ids for /api/deposit/preview and /api/deposit/pay tests.');
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
