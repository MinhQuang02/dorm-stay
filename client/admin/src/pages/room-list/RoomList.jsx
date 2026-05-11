import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

export default function RoomList() {
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/contracts/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setRooms(data.data);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách phòng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // 1. Logic LỌC (Search) - Đã bỏ chữ R
  const filteredRooms = rooms.filter((r) => {
    const query = search.toLowerCase().trim();
    return (
      String(r.idPhong).includes(query) ||
      r.loaiPhong.toLowerCase().includes(query)
    );
  });

  // 2. Logic SẮP XẾP (Sort)
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "price") return a.giaGiuong - b.giaGiuong;
    if (sortBy === "status") return Number(b.trangThaiGiuong) - Number(a.trangThaiGiuong); 
    return a.idPhong - b.idPhong; 
  });

  // 3. Logic PHÂN TRANG (Pagination)
  const totalPages = Math.ceil(sortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = sortedRooms.slice(
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  const handleRecord = (room) => {
    navigate("/record-residence", { state: { selectedRoom: room } });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " VNĐ/tháng";

  return (
    <MainLayout title="Record Residence Information">
      <div className="flex-1 px-4 md:px-8 py-10 bg-[#fbfbfa] min-h-screen flex flex-col items-center">
        
        {/* KHUNG TRẮNG CHỨA TẤT CẢ (Giống Prototype) */}
        <div className="w-full bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-100">
          
          {/* Header: ROOM LIST + Search + Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">ROOM LIST</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search room (e.g., 139 or Standard)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-100 rounded-lg focus:outline-none w-64 text-sm bg-gray-50/50"
                />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-500 mr-2">Sort by :</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-medium outline-none bg-transparent cursor-pointer text-gray-800"
                >
                  <option value="newest">Newest</option>
                  <option value="price">Price</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảng Dữ liệu */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="text-gray-400 text-[13px] border-b border-transparent">
                  <th className="font-medium pb-4 w-[15%]">Room ID</th>
                  <th className="font-medium pb-4 w-[20%]">Room Type</th>
                  <th className="font-medium pb-4 text-center w-[10%]">Capacity</th>
                  <th className="font-medium pb-4 w-[25%]">Price</th>
                  <th className="font-medium pb-4 w-[15%]">Status</th>
                  <th className="font-medium pb-4 text-center w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10 text-gray-500">Loading data...</td></tr>
                ) : paginatedRooms.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-gray-500">No rooms found</td></tr>
                ) : (
                  paginatedRooms.map((room) => (
                    <tr key={`${room.idPhong}-${room.idGiuong}`} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 font-medium text-gray-800 text-[13px]">
                        {room.idPhong} 
                        <span className="ml-2 text-[11px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Bed {room.idGiuong}</span>
                      </td>
                      <td className="py-5 text-gray-700 text-[13px]">{room.loaiPhong}</td>
                      <td className="py-5 text-gray-700 text-center text-[13px]">{room.sucChua}</td>
                      <td className="py-5 text-gray-700 text-[13px]">{formatPrice(room.giaGiuong)}</td>
                      <td className="py-5 text-gray-700 text-[13px]">
                        {room.trangThaiGiuong ? "Available" : "Occupied"}
                      </td>
                      <td className="py-5 text-center">
                        <button
                          onClick={() => handleRecord(room)}
                          disabled={!room.trangThaiGiuong}
                          className={`px-5 py-2 rounded border text-[11px] uppercase font-bold transition-all tracking-wide ${
                            room.trangThaiGiuong 
                              ? "bg-[#faeddb] text-[#d58047] border-[#efd9c2] hover:bg-[#f2dfc5]" 
                              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70"
                          }`}
                        >
                          RECORD
                        </button>
                      </td>
                    </tr>
                  ))
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