// import { useNavigate } from 'react-router-dom';
// import MainLayout from '../../components/Layout/MainLayout';

// export default function Appointment() {
//   const navigate = useNavigate();

//   return (
//     <MainLayout title="Make an Appointment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
//       <div className="bg-[#f3f4f6] rounded-[24px] p-6 md:p-10 shadow-sm flex-1 flex flex-col">
          
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
//               <h2 className="text-lg md:text-[20px] font-bold text-black uppercase tracking-wide">
//                   ROOM VIEWING APPOINTMENT MANAGEMENT
//               </h2>
              
//               <div className="flex flex-wrap items-center gap-4">
//                   <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 min-w-[200px]">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-400">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
//                       </svg>
//                       <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full" />
//                   </div>

//                   <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
//                       <span className="text-sm text-gray-400">Sorted by :</span>
//                       <span className="text-sm font-semibold text-gray-800">Newest</span>
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-600 ml-2">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
//                       </svg>
//                   </div>

//                   <button className="bg-white p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-600">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
//                       </svg>
//                   </button>
//               </div>
//           </div>

//           <div className="overflow-x-auto w-full">
//               <table className="w-full text-left whitespace-nowrap">
//                   <thead>
//                       <tr className="text-gray-400 text-[13px] font-medium border-b border-transparent">
//                           <th className="pb-4 font-medium px-2">Customer ID</th>
//                           <th className="pb-4 font-medium px-2">Customer Name</th>
//                           <th className="pb-4 font-medium px-2">Phone Number</th>
//                           <th className="pb-4 font-medium px-2">Email</th>
//                           <th className="pb-4 font-medium px-2">Proposed Date</th>
//                           <th className="pb-4 font-medium px-2">Action</th>
//                       </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                       <tr className="hover:bg-white/40 transition-colors rounded-lg">
//                           <td className="py-5 px-2 font-medium text-gray-800">CUS0012</td>
//                           <td className="py-5 px-2 text-gray-800">John Doe</td>
//                           <td className="py-5 px-2 text-gray-800">0901234567</td>
//                           <td className="py-5 px-2 text-gray-800">jane@microsoft.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">CUS0015</td>
//                           <td className="py-5 px-2 text-gray-800">Yahoo</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">floyd@yahoo.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">CUS0016</td>
//                           <td className="py-5 px-2 text-gray-800">Adobe</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">ronald@adobe.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">CUS0017</td>
//                           <td className="py-5 px-2 text-gray-800">Tesla</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">marvin@tesla.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">CUS0018</td>
//                           <td className="py-5 px-2 text-gray-800">Google</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">jerome@google.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">Kathryn Murphy</td>
//                           <td className="py-5 px-2 text-gray-800">Microsoft</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">kathryn@microsoft.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">Jacob Jones</td>
//                           <td className="py-5 px-2 text-gray-800">Yahoo</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">jacob@yahoo.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                       <tr className="hover:bg-white/40 transition-colors">
//                           <td className="py-5 px-2 font-medium text-gray-800">Kristin Watson</td>
//                           <td className="py-5 px-2 text-gray-800">Facebook</td>
//                           <td className="py-5 px-2 text-gray-800">0901234590</td>
//                           <td className="py-5 px-2 text-gray-800">kristin@facebook.com</td>
//                           <td className="py-5 px-2 text-gray-800">05/15/2026</td>
//                           <td className="py-5 px-2">
//                               <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
//                           </td>
//                       </tr>
//                   </tbody>
//               </table>
//           </div>

//           <div className="mt-8 flex justify-end items-center gap-1.5 text-[13px] text-gray-500">
//               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">&lt;</button>
//               <button className="w-7 h-7 flex items-center justify-center rounded bg-[#cc6b34] text-white font-medium">1</button>
//               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">2</button>
//               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">3</button>
//               <span className="px-1">..</span>
//               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">4</button>
//               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">&gt;</button>
//           </div>
//       </div>
//     </MainLayout>
//   );
// }



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