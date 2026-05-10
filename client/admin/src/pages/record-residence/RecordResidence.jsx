import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

export default function RecordResidence() {
  const navigate = useNavigate();
  const location = useLocation();

  // Room info được truyền từ RoomList qua navigate state
  const room = location.state?.room || null;

  const [form, setForm] = useState({
    cccd: "",
    idHopDong: "",
    thongTinCT: "",
  });

  const [khachHang, setKhachHang] = useState(null);
  const [hopDongs, setHopDongs] = useState([]);
  const [selectedHopDong, setSelectedHopDong] = useState(null);

  const [searchingKH, setSearchingKH] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Tải danh sách hợp đồng còn hiệu lực
  useEffect(() => {
    fetchHopDongs();
  }, []);

  // Khi chọn idHopDong → cập nhật selectedHopDong
  useEffect(() => {
    if (form.idHopDong) {
      const hd = hopDongs.find((h) => h.idHopDong === parseInt(form.idHopDong));
      setSelectedHopDong(hd || null);
    } else {
      setSelectedHopDong(null);
    }
  }, [form.idHopDong, hopDongs]);

  const fetchHopDongs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/contracts/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHopDongs(data.data);
    } catch (err) {
      console.error("Lỗi tải hợp đồng:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Tìm kiếm khách hàng theo CCCD
  const handleSearchKhachHang = async () => {
    if (!form.cccd.trim()) {
      setErrors((prev) => ({ ...prev, cccd: "Vui lòng nhập CCCD." }));
      return;
    }
    try {
      setSearchingKH(true);
      setKhachHang(null);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/contracts/customer?cccd=${form.cccd.trim()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) {
        setKhachHang(data.data);
        setErrors((prev) => ({ ...prev, cccd: "" }));
      } else {
        setErrors((prev) => ({ ...prev, cccd: "Không tìm thấy khách hàng." }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, cccd: "Lỗi kết nối server." }));
    } finally {
      setSearchingKH(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!khachHang) newErrors.cccd = "Cần tìm và xác nhận khách hàng.";
    if (!form.idHopDong) newErrors.idHopDong = "Vui lòng chọn hợp đồng.";
    if (!room) newErrors.room = "Không có thông tin phòng/giường.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/contracts/residence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idKhachHang: khachHang.idKhachHang,
          idHopDong: parseInt(form.idHopDong),
          idGiuong: room.idGiuong,
          thongTinCT: form.thongTinCT || null,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Ghi nhận cư trú thành công!");
        setTimeout(() => navigate("/rooms"), 2000);
      } else {
        setErrors({ submit: data.message || "Có lỗi xảy ra." });
      }
    } catch (err) {
      setErrors({ submit: "Lỗi kết nối server." });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN");
  };

  return (
    <MainLayout title="Record Residence Information">
      <div className="flex-1 px-6 md:px-12 py-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#faf5ef] px-8 py-5 border-b border-[#f0e8dc]">
              <h2 className="text-center text-lg font-bold text-gray-700 uppercase tracking-widest">
                Record Residence Information
              </h2>
            </div>

            <div className="px-8 py-7 space-y-7">
              {/* Success Message */}
              {successMsg && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {successMsg}
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.submit}
                </div>
              )}

              {/* ── SECTION 1: Customer Information ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Customer Information
                </h3>

                {/* CCCD Search */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    CCCD / ID Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="cccd"
                      value={form.cccd}
                      onChange={handleChange}
                      placeholder="Enter CCCD number..."
                      className={`flex-1 px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 ${
                        errors.cccd ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    <button
                      onClick={handleSearchKhachHang}
                      disabled={searchingKH}
                      className="px-4 py-2.5 bg-[#cc6b34] text-white text-sm font-semibold rounded-xl hover:bg-[#b55e2d] transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {searchingKH ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                      )}
                      Search
                    </button>
                  </div>
                  {errors.cccd && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.cccd}</p>
                  )}
                </div>

                {/* Khách hàng tìm được */}
                {khachHang && (
                  <div className="bg-[#faf5ef] rounded-xl p-4 border border-[#f0e8dc]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#cc6b34] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {khachHang.hoTen?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{khachHang.hoTen}</span>
                      <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">✓ Found</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-500">Phone: </span>
                        {khachHang.sdt}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">CCCD: </span>
                        {khachHang.cccd}
                      </div>
                      {khachHang.email && (
                        <div className="col-span-2">
                          <span className="font-semibold text-gray-500">Email: </span>
                          {khachHang.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* ── SECTION 2: Contract ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Contract
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Contract ID
                  </label>
                  <select
                    name="idHopDong"
                    value={form.idHopDong}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 bg-white ${
                      errors.idHopDong ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <option value="">-- Select Contract --</option>
                    {hopDongs.map((hd) => (
                      <option key={hd.idHopDong} value={hd.idHopDong}>
                        #{hd.idHopDong} — {hd.hinhThuc} ({formatDate(hd.ngayBatDau)} → {formatDate(hd.ngayKetThuc)})
                      </option>
                    ))}
                  </select>
                  {errors.idHopDong && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.idHopDong}</p>
                  )}
                </div>

                {/* Contract preview */}
                {selectedHopDong && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-600 grid grid-cols-2 gap-2">
                    <div><span className="font-semibold">Start:</span> {formatDate(selectedHopDong.ngayBatDau)}</div>
                    <div><span className="font-semibold">End:</span> {formatDate(selectedHopDong.ngayKetThuc)}</div>
                    <div><span className="font-semibold">Type:</span> {selectedHopDong.hinhThuc}</div>
                    <div><span className="font-semibold">Status:</span> {selectedHopDong.trangThai}</div>
                  </div>
                )}
              </section>

              {/* ── SECTION 3: Room Details ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Room Details
                </h3>
                {errors.room && (
                  <p className="text-xs text-red-500 mb-2">{errors.room}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Room ID</label>
                    <input
                      type="text"
                      readOnly
                      value={room ? `#${room.idPhong}` : "—"}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bed ID</label>
                    <input
                      type="text"
                      readOnly
                      value={room ? `B${room.idGiuong}` : "—"}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Room Type</label>
                    <input
                      type="text"
                      readOnly
                      value={room?.loaiPhong || "—"}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price / Month</label>
                    <input
                      type="text"
                      readOnly
                      value={room ? new Intl.NumberFormat("vi-VN").format(room.giaGiuong) + " VNĐ" : "—"}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Additional notes */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="thongTinCT"
                    value={form.thongTinCT}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any extra information..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => navigate("/rooms")}
                className="px-7 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !!successMsg}
                className="px-7 py-2.5 rounded-xl bg-[#cc6b34] text-white text-sm font-bold hover:bg-[#b55e2d] transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                SAVE RECORD
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
