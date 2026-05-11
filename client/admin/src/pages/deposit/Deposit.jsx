import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Deposit() {
  const navigate = useNavigate();
  
  // States cho tra cứu khách hàng
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  
  // States cho Điều kiện lưu trú
  const [rentalTerms, setRentalTerms] = useState([]);
  const [termsLoading, setTermsLoading] = useState(false);

  // States cho danh sách phòng
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // States cho chọn phòng
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('1');
  const statusLabel = selectedStatus === '1' ? 'Nguyên căn' : 'Giường trống';

  // Effect 1: Tra cứu thông tin khách hàng từ /api/deposit/customer (debounce 800ms)
  useEffect(() => {
    const lookupCustomer = async () => {
      if (!customerName.trim() || !customerPhone.trim()) {
        setCustomerInfo(null);
        return;
      }

      setCustomerLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/deposit/customer?hoTen=${encodeURIComponent(customerName.trim())}&sdt=${encodeURIComponent(customerPhone.trim())}`
        );
        
        if (!res.ok) {
          setCustomerInfo(null);
          return;
        }
        
        const data = await res.json();
        
        if (data.success && data.data) {
          const customer = data.data;
          // Lấy phiều yêu cầu, nếu là array thì lấy phần tử đầu
          const phieu = Array.isArray(customer.phieuYeuCau) 
            ? customer.phieuYeuCau[0] 
            : customer.phieuYeuCau || {};

          setCustomerInfo({
            hoTen: customer.hoTen || 'N/A',
            sdt: customer.sdt || 'N/A',
            email: customer.email || 'N/A',
            gioiTinh: customer.gioiTinh || 'N/A',
            ngaySinh: customer.ngaySinh ? new Date(customer.ngaySinh).toLocaleDateString('vi-VN') : 'N/A',
            cccd: customer.cccd || 'N/A',
            quocTich: customer.quocTich || 'N/A',
            
            // PhieuYeuCau data
            khuVucMongMuon: phieu.khuVucMongMuon || 'N/A',
            giaMongMuon: phieu.giaMongMuon ? `${phieu.giaMongMuon.toLocaleString('vi-VN')} VND` : 'N/A',
            loaiPhong: phieu.loaiPhong || 'N/A',
            soNguoi: phieu.soNguoi ? `${phieu.soNguoi} người` : 'N/A',
            hinhThucThue: phieu.hinhThucThue || 'N/A',
            thoiDiemVao: phieu.thoiDiemVao ? new Date(phieu.thoiDiemVao).toLocaleDateString('vi-VN') : 'N/A',
            thoiHanThue: phieu.thoiHanThue ? `${phieu.thoiHanThue} tháng` : 'N/A',
            yeuCauThem: phieu.yeuCauThem || 'Không có',
          });
        } else {
          setCustomerInfo(null);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm khách hàng:", error);
        setCustomerInfo(null);
      } finally {
        setCustomerLoading(false);
      }
    };

    const timer = setTimeout(lookupCustomer, 800);
    return () => clearTimeout(timer);
  }, [customerName, customerPhone]);

  // Effect 2: Fetch Điều kiện lưu trú từ /api/deposit/conditions
  useEffect(() => {
    const fetchTerms = async () => {
      setTermsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/deposit/conditions'); 
        
        // Kiểm tra xem server có trả về HTTP Status 200 không
        if (res.ok) {
          const data = await res.json();
          
          // Thêm dòng log này để kiểm tra xem Backend thực sự trả về gì
          console.log("Dữ liệu API Điều kiện lưu trú trả về:", data); 

          if (data.success && Array.isArray(data.data)) {
            setRentalTerms(data.data);
          } else {
            console.error("Dữ liệu trả về không đúng định dạng mong đợi:", data);
          }
        } else {
          console.error("Lỗi gọi API Điều kiện lưu trú. HTTP Status:", res.status);
        }
      } catch (error) {
        console.error("Lỗi mạng hoặc lỗi hệ thống khi tải điều kiện lưu trú:", error);
      } finally {
        setTermsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Effect 3: Fetch danh sách phòng từ /api/deposit/rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/deposit/rooms');
        
        if (res.ok) {
          const data = await res.json();
          
          // Thêm log để bạn xem dữ liệu thực tế API trả về
          console.log("Dữ liệu API Danh sách phòng trả về:", data);

          if (data.success && Array.isArray(data.data)) {
            setRooms(data.data);
            
            // Đã sửa 'tenPhong' thành 'idPhong' cho khớp với Database
            if (data.data.length > 0) {
              setSelectedRoom(`Phòng ${data.data[0].idPhong} - ${data.data[0].loaiPhong}`);
            }
          }
        } else {
           console.error("Lỗi gọi API Danh sách phòng. HTTP Status:", res.status);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);
    return (
        <MainLayout title="Deposit Term Confirmation" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center">
        <div className="w-full max-w-4xl">
            
            {/* SECTION 1: Customer Info */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-black mb-4">1. Customer & Room Information</h2>
                
                <div className="bg-[#f7ece0] border border-[#ebd7c2] rounded-[24px] p-6 md:p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Customer Name</span>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nhập tên khách hàng"
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-gray-700 text-[14px] outline-none focus:border-[#cc6b34]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Phone Number</span>
                            <input
                                type="text"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Nhập số điện thoại"
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-gray-700 text-[14px] outline-none focus:border-[#cc6b34]"
                            />
                        </div>
                    </div>

                    {customerLoading ? (
                        <div className="rounded-md border border-dashed border-[#cc6b34] bg-white/50 p-6 text-center text-[14px] text-[#cc6b34] font-medium">
                            Đang tải thông tin khách hàng...
                        </div>
                    ) : customerInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#ebd7c2] pt-8">
                            {/* Cột 1: Thông tin cá nhân */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-black text-sm uppercase border-b border-[#ebd7c2] pb-2">Thông tin cá nhân</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Họ & Tên</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.hoTen}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Số điện thoại</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.sdt}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">CCCD</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.cccd}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Giới tính</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.gioiTinh}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ngày sinh</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.ngaySinh}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</span>
                                        <span className="text-[14px] font-bold text-black truncate" title={customerInfo.email}>{customerInfo.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cột 2: Yêu cầu thuê */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-black text-sm uppercase border-b border-[#ebd7c2] pb-2">Nhu cầu thuê</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Loại phòng</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.loaiPhong}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Hình thức</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.hinhThucThue}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Khu vực</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.khuVucMongMuon}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ngân sách</span>
                                        <span className="text-[14px] font-bold text-black">{customerInfo.giaMongMuon}</span>
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Yêu cầu thêm</span>
                                        <span className="text-[14px] font-bold text-black leading-snug">{customerInfo.yeuCauThem}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-[14px] text-gray-500">
                            {customerName.trim() && customerPhone.trim() 
                                ? "Không tìm thấy dữ liệu khách hàng hợp lệ trong hệ thống."
                                : "Nhập Tên và Số điện thoại khách hàng để tra cứu toàn bộ thông tin."}
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 2: Rental Terms & Conditions */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-black mb-4">2. Rental Terms & Conditions</h2>
                
                <div className="bg-[#f7ece0] border border-[#ebd7c2] rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
                    {termsLoading ? (
                        <div className="text-[14px] text-gray-500 text-center py-4">Đang tải các điều khoản...</div>
                  ) : rentalTerms.length > 0 ? (
                      rentalTerms.map((term, index) => (
                          <div key={term.idDieuKien || index}>
                              <p className="text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                  {index + 1}. {term.tenDieuKien || term.name || `Điều kiện ${index + 1}`}
                              </p>
                              <p className="text-[14px] font-bold text-black leading-snug whitespace-pre-wrap">
                                  {term.moTa || term.description || "Chưa có mô tả chi tiết."}
                              </p>
                          </div>
                      ))
                  ) : (
                        <div className="text-[14px] text-gray-500 text-center py-4">Chưa có điều kiện lưu trú nào được thiết lập.</div>
                    )}
                </div>
            </div>

            {/* SECTION 3: Target Room & Final Submit */}
            <div className="flex flex-col gap-4">
                <h3 className="font-bold text-black text-[15px]">Target Room / Bed</h3>
                
                <p className="text-[13px] text-gray-500">Chọn phòng ở ô đầu và chọn trạng thái ở ô bên cạnh.</p>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-[280px]">
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            className="w-full appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-2.5 text-gray-500 text-[14px] outline-none"
                            disabled={roomsLoading}
                        >
                            {roomsLoading ? (
                                <option>Đang tải phòng...</option>
                            ) : rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <option key={room.idPhong} value={`${room.tenPhong} - ${room.loaiPhong}`}>
                                        {room.tenPhong} - {room.loaiPhong}
                                    </option>
                                ))
                            ) : (
                                <option>Không có phòng nào</option>
                            )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <div className="relative w-[280px]">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-2.5 text-gray-500 text-[14px] outline-none"
                        >
                            <option value="1">1 - Nguyên căn</option>
                            <option value="2">2 - Giường trống</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <button className="bg-white border border-[#faeddb] text-[#cc6b34] font-bold text-[14px] px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors">
                        Check Availability
                    </button>
                </div>

                <div className="mt-1">
                    <div className="bg-[#faeddb] border border-[#f0dfc8] text-black font-bold text-[14px] px-5 py-3 rounded-md inline-block">
                        {selectedRoom || 'Chưa chọn phòng'} - {statusLabel} is selected.
                    </div>
                </div>

                <div className="bg-[#f2f2f2] border-[2px] border-dashed border-[#d1d1d1] rounded-lg p-5 flex items-center gap-5 mt-6">
                    <input type="checkbox" className="custom-checkbox shrink-0 w-5 h-5 accent-[#cc6b34]" />
                    <span className="text-[14px] font-bold text-black">I verify that the customer meets all conditions and agrees to the terms above.</span>
                </div>

                <div className="mt-6 flex justify-center">
                    <button onClick={() => navigate('/')} className="bg-[#ce7641] text-white font-bold text-[15px] px-12 py-4 rounded-xl shadow-sm hover:bg-[#b55e2d] transition-colors tracking-wide">
                        CONFIRM AGREEMENT & PROCEED TO DEPOSIT
                    </button>
                </div>
            </div>

        </div>
        </MainLayout>
    );
    }