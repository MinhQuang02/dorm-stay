
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RegisterBooking() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [phieu, setPhieu] = useState(null);
  const [date, setDate] = useState("2026-05-01"); // Mặc định
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedRoom = sessionStorage.getItem('selectedRoom');
    const cachedCustomer = sessionStorage.getItem('currentCustomer');
    const cachedPhieu = sessionStorage.getItem('currentBookingPhieu');

    if (!cachedRoom || !cachedCustomer) {
      navigate('/register-form');
      return;
    }
    setRoom(JSON.parse(cachedRoom));
    setCustomer(JSON.parse(cachedCustomer));
    setPhieu(JSON.parse(cachedPhieu));
  }, [navigate]);

  useEffect(() => {
    const cachedCustomer = sessionStorage.getItem('currentCustomer');

    if (!cachedCustomer) {
      console.error("Không tìm thấy thông tin khách hàng trong session!");
      // navigate('/register-form'); // Nếu không có thì bắt quay lại điền form
      return;
    }

    setCustomer(JSON.parse(cachedCustomer));
  }, []);
  const handleConfirm = async () => {
    // Lấy dữ liệu từ session ra
    const phieu = JSON.parse(sessionStorage.getItem('currentBookingPhieu'));
    const room = JSON.parse(sessionStorage.getItem('selectedRoom'));
    const customer = JSON.parse(sessionStorage.getItem('currentCustomer'));

    if (!phieu || !room) {
      alert("Thiếu thông tin phòng hoặc phiếu yêu cầu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/booking/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phieuId: phieu.idPhieu,
          room: room,
          bookingDetails: {
            date: date, // State ngày bạn đã chọn
            guests: 4
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        // QUAN TRỌNG: Lưu lại tóm tắt để trang RegisterSuccess.jsx hiển thị được
        sessionStorage.setItem('bookingSummary', JSON.stringify({
          roomName: room.name,
          address: room.address,
          date: date,
          customer: customer
        }));

        // Chuyển sang trang thành công
        navigate('/register-success');
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (err) {
      alert("Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  if (!room || !customer) return null;

  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-16 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
        <div className="flex flex-col gap-8">
          {/* Hiển thị thông tin phòng đã chọn dynamic */}
          <h2 className="text-[32px] font-bold text-gray-900">{room.name}</h2>
          <p className="text-gray-500">{room.address}</p>
          <img src={room.img} className="w-full h-[380px] object-cover rounded-lg" />
        </div>

        <div className="sticky top-[100px] bg-[#e9e9e9] rounded-2xl p-8 flex flex-col gap-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#cc6b34] flex items-center justify-center text-white font-bold text-xl">
              {customer.hoTen.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{customer.hoTen}</h4>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Select viewing date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-400 bg-white rounded-xl px-4 py-3 mb-5 outline-none"
            />

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-[#262626] text-white py-3.5 rounded-lg text-sm font-bold hover:bg-black transition-all"
            >
              {loading ? "Processing..." : "CONFIRM"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}