import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RegisterBooking() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [phieu, setPhieu] = useState(null);
  const [date, setDate] = useState("2026-05-01"); // Mặc định ngày xem phòng
  const [loading, setLoading] = useState(false);

  // 1. Load toàn bộ dữ liệu từ sessionStorage khi trang vừa mở
  useEffect(() => {
    const cachedRoom = sessionStorage.getItem('selectedRoom');
    const cachedCustomer = sessionStorage.getItem('currentCustomer');
    const cachedPhieu = sessionStorage.getItem('currentBookingPhieu');

    // Nếu thiếu thông tin bắt buộc, quay lại bước chọn phòng hoặc điền form
    if (!cachedRoom || !cachedCustomer || !cachedPhieu) {
      console.warn("Missing session data, redirecting...");
      navigate('/register-form');
      return;
    }

    setRoom(JSON.parse(cachedRoom));
    setCustomer(JSON.parse(cachedCustomer));
    setPhieu(JSON.parse(cachedPhieu));
  }, [navigate]);

  // 2. Xử lý gửi yêu cầu đặt lịch cuối cùng
  const handleConfirm = async () => {
    if (!phieu || !room || !customer) {
      alert("Missing information to complete booking.");
      return;
    }

    setLoading(true);
    try {
      // Gửi phieuId, thông tin phòng và ngày hẹn lên Server
      const res = await fetch('http://127.0.0.1:5000/api/booking/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phieuId: phieu.idPhieu,
          room: room, 
          bookingDetails: {
            date: date,
            guests: 1 // Bạn có thể thêm input chọn số người nếu cần
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        // Lưu tóm tắt để trang RegisterSuccess.jsx hiển thị
        sessionStorage.setItem('bookingSummary', JSON.stringify({
          roomName: room.name,
          address: room.address,
          date: date,
          customer: customer
        }));

        navigate('/register-success');
      } else {
        alert("Lỗi từ server: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Tránh render khi dữ liệu chưa load xong
  if (!room || !customer) return null;

  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-16 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
        
        {/* BÊN TRÁI: CHI TIẾT PHÒNG & TÀI SẢN */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link to="/register-find" className="hover:bg-gray-200 p-1 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-800">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </Link>
              <h2 className="text-[32px] font-bold text-gray-900 tracking-tight">{room.name}</h2>
            </div>
            <p className="text-gray-500 mb-6 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {room.address}
            </p>
          </div>

          <img src={room.img} alt="Selected Room" className="w-full h-[400px] object-cover rounded-3xl shadow-sm" />

          {/* DYNAMIC AMENITIES FROM DATABASE */}
          <div className="mt-4">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Room Assets & Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 text-sm text-gray-800">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((asset, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-[#faeddb] rounded-lg flex items-center justify-center group-hover:bg-[#cc6b34] transition-colors duration-300">
                      <svg className="w-4 h-4 text-[#cc6b34] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="font-medium">{asset}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No specific assets listed for this room.</p>
              )}
            </div>
          </div>

          <div className="mt-4 mb-10">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm text-gray-400">Building Services</h3>
            <div className="flex flex-wrap gap-4">
               {['Security 24/7', 'Parking', 'Laundry'].map(s => (
                 <span key={s} className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">{s}</span>
               ))}
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: THÔNG TIN KHÁCH HÀNG & XÁC NHẬN (STICKY) */}
        <div className="sticky top-[100px] bg-[#f9f9f9] rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#cc6b34] flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#cc6b34]/20">
              {customer.hoTen ? customer.hoTen.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{customer.hoTen}</h4>
              <p className="text-sm text-gray-400">{customer.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm font-bold text-gray-900 mb-4">When do you want to view?</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 mb-6 outline-none focus:border-[#cc6b34] transition-all font-medium"
            />

            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#262626] hover:bg-black'} text-white py-4 rounded-xl text-sm font-bold tracking-widest transition-all shadow-md`}
            >
              {loading ? "PROCESSING..." : "CONFIRM VIEWING"}
            </button>
            
            <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed px-4">
              By clicking confirm, your information and room choice will be sent to our staff for scheduling.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}