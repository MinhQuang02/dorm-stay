import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    hoTen: '',
    cccd: '',
    sdt: '',
    email: ''
  });

  // LOGIC MỚI: Tự động lấy dữ liệu người dùng hiện tại khi vừa vào trang
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        // Chúng ta giả định tài khoản test là 464
        // Gọi API để lấy thông tin Khách hàng đã lưu cho tài khoản này
        const res = await fetch(`http://127.0.0.1:5000/api/finance/contracts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 464 }) 
        });
        const data = await res.json();

        // Nếu tài khoản này đã có thông tin khách hàng trong DB
        if (data.contracts && data.contracts.length > 0) {
          const profile = data.contracts[0]; // Lấy thông tin từ hợp đồng gần nhất
          setFormData({
            hoTen: profile.customerName || '',
            cccd: profile.cccd || '',
            sdt: profile.phone || '',
            email: profile.email || 'huynhvansinh1810@gmail.com' // Email đăng nhập của bạn
          });
        } else {
          // Nếu chưa có hồ sơ, ít nhất cũng điền sẵn Email từ phiên đăng nhập
          setFormData(prev => ({...prev, email: 'huynhvansinh1810@gmail.com'}));
        }
      } catch (error) {
        console.error("Không thể load profile cũ:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/booking/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('currentBookingPhieu', JSON.stringify(data.data.phieu));
        sessionStorage.setItem('currentCustomer', JSON.stringify(data.data.customer));
        navigate('/register-find');
      } else {
        alert(data.error || "Đăng ký thông tin thất bại.");
      }
    } catch (err) {
      alert("Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <MainLayout><div className="p-20 text-center text-gray-500">Đang chuẩn bị dữ liệu...</div></MainLayout>;

  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-8 md:px-24 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Info</h2>
          <p className="text-sm text-gray-500">Please verify your information for the booking:</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleNext}>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Full Name <span className="text-gray-400">(Tên của bạn)</span></label>
            <input
              type="text"
              required
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
              placeholder="Enter Full Name"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">ID Card <span className="text-gray-400">(CCCD)</span></label>
            <input
              type="text"
              required
              value={formData.cccd}
              onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
              placeholder="Enter ID number"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.sdt}
              onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
              placeholder="Enter phone number"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Email <span className="text-gray-400">(Dùng để nhận thông báo)</span></label>
            <input
              type="email"
              readOnly={formData.email.includes('@')} // Nếu đã có email từ tài khoản thì cho xem thôi, không cho sửa linh tinh
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-500 outline-none"
            />
          </div>

          {/* Bỏ cái bảng màu vàng báo lỗi "Không tìm thấy" đi cho đỡ rối */}

          <div className="flex justify-between items-center mt-12">
            <Link to="/" className="px-12 py-3 rounded-lg border border-[#cc6b34] text-[#cc6b34] text-sm font-medium hover:bg-orange-50 transition-all">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 rounded-lg bg-[#cc6b34] text-white text-sm font-medium hover:bg-[#b55e2d] shadow-md transition-all"
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}