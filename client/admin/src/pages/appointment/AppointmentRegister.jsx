// import { useNavigate } from 'react-router-dom';
// import MainLayout from '../../components/Layout/MainLayout';

// export default function AppointmentRegister() {
//   const navigate = useNavigate();

//   return (
//     <MainLayout title="Make an Appointment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
//       <div className="bg-[#f3f4f6] rounded-[24px] p-6 md:p-12 shadow-sm flex-1 flex flex-col items-center justify-center">

//           <div className="w-full max-w-[700px] flex flex-col gap-8">
//               <h2 className="text-xl md:text-[22px] font-bold text-[#544a3e] text-center tracking-wide uppercase">
//                   SCHEDULE ROOM VIEWING
//               </h2>

//               <form className="flex flex-col gap-6">
//                   <div>
//                       <p className="text-sm font-medium text-gray-700 mb-4">Customer Information:</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                           <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Full Name</label>
//                               <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
//                           </div>
//                           <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Phone</label>
//                               <input type="text" defaultValue="0901234567" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
//                           </div>
//                       </div>
//                   </div>

//                   <div>
//                       <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Room to view:</label>
//                       <input type="text" defaultValue="Room 101 (District 5 Branch)" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
//                   </div>

//                   <div>
//                       <p className="text-sm font-medium text-gray-700 mb-4">Scheduling Details:</p>
//                       <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-5">
//                           <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Date</label>
//                               <input type="text" defaultValue="28.08.2025 - 28.08.2025" className="w-full px-4 py-3 rounded-lg border border-[#cc6b34] outline-none text-gray-400 text-sm bg-white" />
//                           </div>
//                           <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Time</label>
//                               <input type="text" defaultValue="9:00am - 12:00pm" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
//                           </div>
//                           <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Guests</label>
//                               <input type="text" defaultValue="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
//                           </div>
//                       </div>
//                   </div>

//                   <div className="flex items-center justify-center gap-6 mt-8">
//                       <button onClick={() => navigate('/appointment')} type="button" className="w-[180px] py-3 rounded-full border border-[#cc6b34] bg-white text-black font-bold text-sm tracking-wide hover:bg-[#faeddb] transition-colors">
//                           CANCEL
//                       </button>
//                       <button onClick={() => navigate('/appointment')} type="button" className="w-[180px] py-3 rounded-full border border-[#cc6b34] bg-[#cc6b34] text-white font-bold text-sm tracking-wide hover:bg-[#b55e2d] transition-colors">
//                           SAVE & SEND
//                       </button>
//                   </div>
//               </form>
//           </div>

//       </div>
//     </MainLayout>
//   );
// }


import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function AppointmentRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phieuId = searchParams.get('phieuId'); // Lấy id từ URL

  const [requestDetail, setRequestDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho Form đặt lịch
  const [formData, setFormData] = useState({
    date: '',
    time: '09:00',
    location: 'Homestay Dorm Office'
  });

  // 1. Load thông tin khách hàng từ phieuId
  useEffect(() => {
    if (phieuId) {
      fetch(`http://localhost:5000/api/admin/appointments/detail/${phieuId}`)
        .then(r => r.json())
        .then(data => setRequestDetail(data))
        .catch(err => console.error(err));
    }
  }, [phieuId]);

  // 2. Hàm lưu lịch hẹn
  const handleSave = async () => {
    if (!formData.date) return alert("Vui lòng chọn ngày hẹn!");

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPhieu: phieuId,
          date: `${formData.date}T${formData.time}:00Z`, // Gộp ngày giờ thành ISO
          location: formData.location
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Lịch hẹn đã được lưu thành công!");
        navigate('/appointment');
      }
    } catch (error) {
      alert("Lỗi khi lưu lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  if (!requestDetail) return <div className="p-10 text-center">Loading...</div>;

  return (
    <MainLayout title="Make an Appointment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
      <div className="bg-[#f3f4f6] rounded-[24px] p-6 md:p-12 shadow-sm flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[700px] flex flex-col gap-8">
          <h2 className="text-xl font-bold text-[#544a3e] text-center tracking-wide uppercase">
            SCHEDULE ROOM VIEWING
          </h2>

          <form className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Customer Information:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input readOnly value={requestDetail.taiKhoanMoiNhat?.khachHang?.hoTen || ""} className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm" />
                <input readOnly value={requestDetail.taiKhoanMoiNhat?.khachHang?.sdt || ""} className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Room Requirements:</label>
              <input readOnly value={`${requestDetail.loaiPhong} - ${requestDetail.hinhThucThue}`} className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Room to view:</label>
              <div className="flex flex-col gap-2">
                {/* Hiển thị Tên phòng */}
                <input
                  readOnly
                  value={requestDetail.loaiPhong || ""}
                  className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm font-bold text-gray-700"
                  placeholder="Room Name"
                />
                {/* Hiển thị Địa chỉ phòng */}
                <input
                  readOnly
                  value={requestDetail.khuVucMongMuon || ""}
                  className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-xs text-gray-500"
                  placeholder="Room Address"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Scheduling Details:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-500 ml-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#cc6b34] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 ml-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <button onClick={() => navigate('/appointment')} type="button" className="w-[180px] py-3 rounded-full border border-[#cc6b34] bg-white font-bold text-sm">
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-[180px] py-3 rounded-full bg-[#cc6b34] text-white font-bold text-sm tracking-wide"
              >
                {loading ? "SAVING..." : "SAVE & SEND"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}