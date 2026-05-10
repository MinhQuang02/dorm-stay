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
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/contracts/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRooms(data.data);
    } catch (err) {
      console.error("Lỗi tải danh sách phòng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter + sort
  const filtered = rooms
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        String(r.idPhong).includes(q) ||
        r.loaiPhong.toLowerCase().includes(q) ||
        String(r.idGiuong).includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.giaGiuong - b.giaGiuong;
      if (sortBy === "status") return Number(b.trangThaiGiuong) - Number(a.trangThaiGiuong);
      return a.idPhong - b.idPhong;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRecord = (room) => {
    navigate("/record-residence", { state: { room } });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " VNĐ/tháng";

  return (
    <MainLayout title="Record Residence Information">
      <div className="flex-1 px-6 md:px-12 py-8">
        {/* Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-700 tracking-wide uppercase">
            Room List
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 bg-white w-48"
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 bg-white cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#faf5ef] border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Room ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Bed ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Room Type</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Capacity</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#cc6b34] border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((room, idx) => (
                    <tr
                      key={`${room.idPhong}-${room.idGiuong}`}
                      className={`border-b border-gray-50 hover:bg-[#fdf9f5] transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-700">#{room.idPhong}</td>
                      <td className="px-5 py-3.5 text-gray-600">B{room.idGiuong}</td>
                      <td className="px-5 py-3.5 text-gray-600">{room.loaiPhong}</td>
                      <td className="px-5 py-3.5 text-gray-600">{room.sucChua}</td>
                      <td className="px-5 py-3.5 text-gray-600">{formatPrice(room.giaGiuong)}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            room.trangThaiGiuong
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              room.trangThaiGiuong ? "bg-emerald-500" : "bg-red-400"
                            }`}
                          />
                          {room.trangThaiGiuong ? "Available" : "Occupied"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleRecord(room)}
                          disabled={!room.trangThaiGiuong}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                            room.trangThaiGiuong
                              ? "bg-[#cc6b34] text-white hover:bg-[#b55e2d] shadow-sm hover:shadow-md active:scale-95"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-4 border-t border-gray-50">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-[#cc6b34] text-white shadow-sm"
                      : "text-gray-500 hover:bg-[#faf5ef]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
