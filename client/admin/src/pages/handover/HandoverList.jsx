import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

// 1. Cập nhật lại bộ màu sắc theo đúng ý bạn
const STATUS_LABEL = {
  OCCUPYING: { text: 'Occupying', bg: 'bg-yellow-50',  dot: 'bg-yellow-500', text_color: 'text-yellow-600'  },
  EXPIRED:   { text: 'Expired',   bg: 'bg-red-50',     dot: 'bg-red-500',    text_color: 'text-red-600'     },
  DONE:      { text: 'Done',      bg: 'bg-emerald-50', dot: 'bg-emerald-500', text_color: 'text-emerald-600' },
};

export default function HandoverList() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API_BASE}/handover/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) setContracts(data.data);
    } catch (err) {
      console.error('Error fetching handover contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm tính toán trạng thái động
  const getComputedStatus = (contract) => {
    // Nếu đã làm biên bản bàn giao -> Done
    if (contract.daBanGiao) return 'DONE';

    // Nếu chưa bàn giao, kiểm tra xem có quá hạn không
    if (contract.ngayKetThuc) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đưa về đầu ngày để so sánh chuẩn xác
      
      const expDate = new Date(contract.ngayKetThuc);
      expDate.setHours(0, 0, 0, 0);

      if (today > expDate) return 'EXPIRED';
    }

    // Còn lại là đang thuê bình thường
    return 'OCCUPYING';
  };

  // ── Filter ──
  const filtered = contracts
    .filter((r) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        String(r.idHopDong).includes(q) ||
        (r.customerName || '').toLowerCase().includes(q) ||
        String(r.idPhong).includes(q) ||
        (r.loaiPhong || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.ngayBatDau) - new Date(a.ngayBatDau);
      if (sortBy === 'status') {
        // Sắp xếp ưu tiên: Expired -> Occupying -> Done
        const order = { EXPIRED: 0, OCCUPYING: 1, DONE: 2 };
        const statusA = getComputedStatus(a);
        const statusB = getComputedStatus(b);
        return (order[statusA] ?? 9) - (order[statusB] ?? 9);
      }
      return b.idHopDong - a.idHopDong;
    });

  // ── Pagination Logic ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPaginationRange = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  const handleSearchChange = (e) => { setSearch(e.target.value); setCurrentPage(1); };
  const handleSortChange   = (e) => { setSortBy(e.target.value); setCurrentPage(1); };

  const handleRecord = (contract) => {
    navigate('/handover/register', { state: { contract } });
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  return (
    <MainLayout title="Apartment Handover Record">
      <div className="flex-1 px-4 md:px-8 py-10 bg-[#fbfbfa] min-h-screen flex flex-col items-center">
        
        {/* KHUNG TRẮNG CHỨA TẤT CẢ */}
        <div className="w-full bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">HANDOVER LIST</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search contract, customer..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9 pr-4 py-2 border border-gray-100 rounded-lg focus:outline-none w-64 text-sm bg-gray-50/50"
                />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-500 mr-2">Sort by :</span>
                <select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="font-medium outline-none bg-transparent cursor-pointer text-gray-800"
                >
                  <option value="newest">Newest</option>
                  <option value="date">Begin Date</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảng Dữ liệu */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-gray-400 text-[13px] border-b border-transparent">
                  <th className="font-medium pb-4 w-[15%]">Room ID</th>
                  <th className="font-medium pb-4 w-[25%]">Customer Name</th>
                  <th className="font-medium pb-4 w-[15%]">Begin Date</th>
                  <th className="font-medium pb-4 w-[15%]">Expired Date</th>
                  <th className="font-medium pb-4 w-[15%]">Status</th>
                  <th className="font-medium pb-4 text-center w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10 text-gray-500">Loading data...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-gray-500">No contracts found</td></tr>
                ) : (
                  paginated.map((contract) => {
                    // 3. Gọi hàm tính toán trạng thái động cho từng row
                    const computedStatus = getComputedStatus(contract);
                    const statusInfo = STATUS_LABEL[computedStatus];

                    return (
                      <tr key={`${contract.idHopDong}-${contract.idGiuong}`} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 font-medium text-gray-800 text-[13px]">
                          {contract.idPhong}
                          {contract.idGiuong && (
                            <span className="ml-2 text-[11px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              Bed {contract.idGiuong}
                            </span>
                          )}
                        </td>
                        <td className="py-5 text-gray-700 text-[13px]">{contract.customerName}</td>
                        <td className="py-5 text-gray-700 text-[13px]">{formatDate(contract.ngayBatDau)}</td>
                        <td className="py-5 text-gray-700 text-[13px]">{formatDate(contract.ngayKetThuc)}</td>
                        <td className="py-5 text-[13px]">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.text_color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="py-5 text-center">
                          {/* 4. Vô hiệu hóa nút bấm nếu đã Done */}
                          <button
                            onClick={() => handleRecord(contract)}
                            disabled={computedStatus === 'DONE'}
                            className={`px-5 py-2 rounded border text-[11px] uppercase font-bold transition-all tracking-wide ${
                              computedStatus === 'DONE' 
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70" 
                                : "bg-[#faeddb] text-[#d58047] border-[#efd9c2] hover:bg-[#f2dfc5]"
                            }`}
                          >
                            {computedStatus === 'DONE' ? 'RECORDED' : 'RECORD'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang (Pagination) */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-1.5 mt-8 text-xs font-medium">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-6 h-6 flex justify-center items-center text-gray-400 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              
              {paginationRange.map((item, index) => {
                if (item === '...') {
                  return (
                    <span key={`dots-${index}`} className="w-4 h-6 flex justify-center items-end text-gray-400 pb-1.5">
                      ..
                    </span>
                  );
                }
                return (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={
                      currentPage === item 
                        ? "w-6 h-6 flex justify-center items-center bg-[#d58047] text-white rounded"
                        : "w-6 h-6 flex justify-center items-center text-gray-500 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                    }
                  >
                    {item}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-6 h-6 flex justify-center items-center text-gray-400 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}