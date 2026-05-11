import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

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

  // State cho chọn phòng
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isAgreed, setIsAgreed] = useState(false); // Checkbox điều khoản

  // State MỚI: Dùng để bật/tắt bảng thông báo thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Biến phụ trợ để lấy thông tin chi tiết của phòng đang được chọn
  const selectedRoomObj = rooms.find(r => r.idPhong.toString() === selectedRoom);

  // Effect 1: Tra cứu thông tin khách hàng (debounce 800ms)
  useEffect(() => {
    const lookupCustomer = async () => {
      if (!customerName.trim() || !customerPhone.trim()) {
        setCustomerInfo(null);
        return;
      }

      setCustomerLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE}/deposit/customer?hoTen=${encodeURIComponent(customerName.trim())}&sdt=${encodeURIComponent(customerPhone.trim())}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (!res.ok) {
          setCustomerInfo(null);
          return;
        }
        
        const data = await res.json();
        
        if (data.success && data.data) {
          const customer = data.data;
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

  // Effect 2: Fetch Điều kiện lưu trú
  useEffect(() => {
    const fetchTerms = async () => {
      setTermsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/deposit/conditions`, {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setRentalTerms(data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi tải điều kiện lưu trú:", error);
      } finally {
        setTermsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Effect 3: Fetch danh sách phòng
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/deposit/rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setRooms(data.data);
            if (data.data.length > 0) {
              setSelectedRoom(data.data[0].idPhong.toString());
            }
          }
        }
      } catch (error) {
        console.error("Lỗi tải danh sách phòng:", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Hàm xử lý khi bấm nút "PROCEED TO DEPOSIT"
  const handleSubmit = () => {
    // Tương lai bro có thể gọi API lưu xuống database ở đây
    
    // Hiện bảng thông báo thành công
    setShowSuccessModal(true);
  };

  // Hàm xử lý khi bấm nút "Hoàn tất" trong bảng thông báo
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/'); // Đá về trang chủ
  };

  return (
    <MainLayout title="Deposit Term Confirmation">
      <div className="flex-1 px-4 md:px-8 py-10 bg-[#fbfbfa] min-h-screen flex flex-col items-center relative">
        
        <div className="w-full max-w-5xl bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-100">
            
          {/* Header */}
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">DEPOSIT CONFIRMATION</h2>
            <p className="text-[13px] text-gray-500 mt-1">Please verify customer information and select terms for the deposit.</p>
          </div>

          {/* SECTION 1: Customer Info */}
          <div className="mb-10">
            <h3 className="text-[13px] font-bold text-[#d58047] uppercase tracking-wider mb-4">1. Customer Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1.5 relative">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Customer Name</span>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="E.g., John Doe"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d58047] text-[13px] text-gray-800 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Phone Number</span>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="E.g., 0901234567"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d58047] text-[13px] text-gray-800 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Khung kết quả tra cứu */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 transition-all min-h-[120px] flex flex-col justify-center">
              {customerLoading ? (
                <div className="text-center text-[13px] text-[#d58047] font-medium flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#d58047] border-t-transparent rounded-full animate-spin" />
                  Searching customer data...
                </div>
              ) : customerInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-gray-800 text-[12px] uppercase tracking-wide border-b border-gray-200 pb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Full Name</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.hoTen}</p></div>
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Phone</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.sdt}</p></div>
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">ID / CCCD</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.cccd}</p></div>
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Gender</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.gioiTinh}</p></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-gray-800 text-[12px] uppercase tracking-wide border-b border-gray-200 pb-2">Rental Requirements</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Room Type</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.loaiPhong}</p></div>
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Form</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.hinhThucThue}</p></div>
                      <div><p className="text-[11px] text-gray-400 font-medium uppercase">Budget</p><p className="text-[13px] font-medium text-gray-800">{customerInfo.giaMongMuon}</p></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[13px] text-gray-400">
                  {customerName.trim() && customerPhone.trim() ? "No matching customer found in the system." : "Enter customer Name and Phone Number to fetch details."}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Rental Terms & Conditions */}
          <div className="mb-10">
            <h3 className="text-[13px] font-bold text-[#d58047] uppercase tracking-wider mb-4">2. Rental Terms & Conditions</h3>
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 max-h-64 overflow-y-auto custom-scrollbar">
              {termsLoading ? (
                <div className="text-[13px] text-gray-400 text-center py-4">Loading terms...</div>
              ) : rentalTerms.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {rentalTerms.map((term, index) => (
                    <div key={term.idDieuKien || index} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
                      <p className="text-[12px] font-bold text-gray-600 mb-1 tracking-wide">{index + 1}. {term.tenDieuKien || term.name}</p>
                      <p className="text-[13px] text-gray-500 leading-relaxed whitespace-pre-wrap">{term.moTa || term.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[13px] text-gray-400 text-center py-4">Chưa có điều kiện lưu trú nào được thiết lập.</div>
              )}
            </div>
          </div>

          {/* SECTION 3: Target Room & Finalization */}
          <div>
            <h3 className="text-[13px] font-bold text-[#d58047] uppercase tracking-wider mb-4">3. Target Room & Finalization</h3>
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Select Room */}
                <div className="flex items-center bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2.5 w-full lg:w-72">
                  <span className="text-gray-500 text-[13px] mr-3 whitespace-nowrap">Room:</span>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full bg-transparent outline-none text-[13px] text-gray-800 font-medium cursor-pointer"
                    disabled={roomsLoading}
                  >
                    {roomsLoading ? <option>Loading...</option> : rooms.length > 0 ? rooms.map((room) => (
                      <option key={room.idPhong} value={room.idPhong.toString()}>{room.tenPhong || `Phòng ${room.idPhong}`} - {room.loaiPhong}</option>
                    )) : <option>No rooms</option>}
                  </select>
                </div>
              </div>

              {/* Thông tin chi tiết phòng */}
              {selectedRoomObj && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#faeddb]/30 border border-[#efd9c2] rounded-xl p-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2723c] font-bold uppercase">Trạng thái</span>
                    <span className="text-[13px] font-semibold text-gray-800">{selectedRoomObj.trangThai || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2723c] font-bold uppercase">Sức chứa</span>
                    <span className="text-[13px] font-semibold text-gray-800">{selectedRoomObj.sucChua ? `${selectedRoomObj.sucChua} người` : 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2723c] font-bold uppercase">Điện & Nước</span>
                    <span className="text-[13px] font-semibold text-gray-800">{selectedRoomObj.chiPhiDienNuoc ? `${selectedRoomObj.chiPhiDienNuoc.toLocaleString('vi-VN')} VND` : 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 gap-4 mt-8">
              <button 
                onClick={() => navigate(-1)} 
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-[12px] uppercase font-bold text-gray-500 hover:bg-gray-50 transition-colors tracking-wide"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!customerInfo || !selectedRoom}
                className="px-8 py-2.5 rounded-lg text-[12px] uppercase font-bold transition-all tracking-wide bg-[#d58047] text-white hover:bg-[#c2723c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PROCEED TO DEPOSIT
              </button>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* MODAL THÔNG BÁO THÀNH CÔNG */}
        {/* ========================================== */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-[24px] p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-2xl transform scale-100 animate-fade-in-up">
              
              {/* Icon tick xanh tròn */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              {/* Text thông báo */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-wide">Thành công!</h3>
              <p className="text-gray-500 text-[14px] mb-8 leading-relaxed">
                Xác nhận đặt cọc thành công cho khách hàng <br/> <strong className="text-gray-800">{customerInfo?.hoTen}</strong>.
              </p>
              
              {/* Nút đóng */}
              <button
                onClick={handleCloseModal}
                className="w-full py-3 bg-[#d58047] text-white rounded-xl text-[13px] font-bold uppercase tracking-widest hover:bg-[#c2723c] transition-colors shadow-md hover:shadow-lg"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}