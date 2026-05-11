
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Appointment() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchRequests = () => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/api/admin/appointments/pending')
      .then(r => r.json())
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  // Xử lý Hoàn tất xem phòng
  const handleComplete = async (idLichHen) => {
    if (!window.confirm("Xác nhận khách hàng đã hoàn tất việc xem phòng?")) return;
    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/appointments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idLichHen })
      });
      if (res.ok) {
        alert("Đã cập nhật trạng thái: Đã xem.");
        fetchRequests(); // Reload danh sách
      }
    } catch (err) { alert("Lỗi kết nối server."); }
  };

  const filteredData = requests
    .filter(item => item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || item.idPhieu.toString().includes(searchTerm))
    .sort((a, b) => sortBy === 'Newest' ? b.idPhieu - a.idPhieu : a.idPhieu - b.idPhieu);

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <MainLayout title="Appointments" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-xl font-bold text-gray-800 uppercase">ROOM VIEWING MANAGEMENT</h2>
          <div className="flex items-center gap-4">
            <input 
              type="text" placeholder="Search customer..." 
              className="bg-[#f9f9f9] px-4 py-2.5 rounded-2xl border text-sm w-[280px] outline-none focus:border-[#cc6b34]"
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
            <select className="bg-[#f9f9f9] px-4 py-2.5 rounded-2xl border text-sm font-bold" onChange={(e) => setSortBy(e.target.value)}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[13px] font-bold border-b">
                <th className="pb-6 px-4">ID</th>
                <th className="pb-6 px-4">Customer Name</th>
                <th className="pb-6 px-4">Email</th>
                <th className="pb-6 px-4">Phone</th>
                <th className="pb-6 px-4">Proposed Date</th>
                <th className="pb-6 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {!loading && currentItems.map((req) => (
                <tr key={req.idPhieu} className="hover:bg-gray-50 border-b last:border-none">
                  <td className="py-6 px-4 font-semibold text-gray-700">#{req.idPhieu}</td>
                  <td className="py-6 px-4">{req.customerName}</td>
                  <td className="...">{req.email}</td>
                  <td className="py-6 px-4">{req.phone}</td>
                  <td className="py-6 px-4">{req.proposedDate === "Flexible" ? "Flexible" : new Date(req.proposedDate).toLocaleDateString('vi-VN')}</td>
                  <td className="py-6 px-4 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/appointment/register?phieuId=${req.idPhieu}`)}
                      className="border border-[#cc6b34] text-[#cc6b34] px-4 py-1.5 rounded-lg text-[11px] font-extrabold uppercase hover:bg-[#cc6b34] hover:text-white transition-all"
                    >
                      {req.hasSchedule ? "Edit" : "Schedule"}
                    </button>
                    {req.hasSchedule && (
                      <button 
                        onClick={() => handleComplete(req.idLichHen)}
                        className="p-1.5 rounded-lg border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                        title="Mark as Viewed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m4.5 12.75 6 6 9-13.5"/></svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-end gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === i+1 ? 'bg-[#cc6b34] text-white' : 'text-gray-400 bg-gray-50'}`}>
              {i+1}
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}