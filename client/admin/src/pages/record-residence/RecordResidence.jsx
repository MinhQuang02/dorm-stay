import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

export default function RecordResidence() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoom = location.state?.selectedRoom || null;

  const [activeContracts, setActiveContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ fullName: "", phone: "", idKhachHang: null });
  
  // 1. Quản lý cả hai ngày
  const [formData, setFormData] = useState({
    beginDate: "",
    endDate: "", 
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/contracts/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setActiveContracts(data.data);
      } catch (err) { console.error("Lỗi tải danh sách hợp đồng:", err); }
    };
    if (selectedRoom) fetchContracts(); else navigate("/rooms");
  }, [selectedRoom, navigate]);

  // 2. Tự động lấy CẢ HAI ngày từ hợp đồng lên
  useEffect(() => {
    if (selectedContractId) {
      const contract = activeContracts.find(c => c.idHopDong === parseInt(selectedContractId));
      if (contract) {
        const kh = (contract.chiTiets && contract.chiTiets.length > 0) 
                   ? contract.chiTiets[0].khachHang 
                   : contract.phieu?.khachHang;
        
        if (kh) {
          setCustomerInfo({ fullName: kh.hoTen || "N/A", phone: kh.sdt || "N/A", idKhachHang: kh.idKhachHang });
        }
        
        // Tự hiển thị ngày bắt đầu và ngày kết thúc
        setFormData({
          beginDate: contract.ngayBatDau ? new Date(contract.ngayBatDau).toISOString().split('T')[0] : "",
          endDate: contract.ngayKetThuc ? new Date(contract.ngayKetThuc).toISOString().split('T')[0] : ""
        });
      }
    } else {
      setCustomerInfo({ fullName: "", phone: "", idKhachHang: null });
      setFormData({ beginDate: "", endDate: "" });
    }
  }, [selectedContractId, activeContracts]);

  // 3. Xử lý LƯU
  const handleSave = async () => {
    if (!selectedContractId || !customerInfo.idKhachHang || !formData.beginDate || !formData.endDate) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin và chọn ngày bắt đầu/kết thúc!");
      return;
    }

    const contract = activeContracts.find(c => c.idHopDong === parseInt(selectedContractId));
    const isFullRoom = contract?.hinhThuc === 'NGUYEN_PHONG';
    
    try {
      setSubmitting(true);
      setErrorMsg("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/contracts/residence`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          idKhachHang: customerInfo.idKhachHang,
          idHopDong: parseInt(selectedContractId),
          idGiuong: selectedRoom.idGiuong,
          idPhong: selectedRoom.idPhong,
          isFullRoom: isFullRoom,
          beginDate: formData.beginDate, // Gửi ngày bắt đầu
          endDate: formData.endDate,     // Gửi ngày kết thúc
          thongTinCT: isFullRoom ? 'Thuê nguyên phòng' : 'Thuê giường lẻ' // Dọn sạch thongTinCT
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Ghi nhận cư trú thành công!");
        setTimeout(() => navigate("/rooms"), 2000);
      } else {
        setErrorMsg(data.message || "Lỗi khi lưu dữ liệu.");
      }
    } catch (err) { setErrorMsg("Lỗi kết nối server."); } finally { setSubmitting(false); }
  };

  if (!selectedRoom) return null;

  return (
    <MainLayout title="Record Residence Information">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbfbfa] py-10 px-4">
        <div className="w-full max-w-3xl bg-[#fafafa] rounded-2xl shadow-sm border border-gray-100 p-10">
          <h1 className="text-2xl font-bold text-center text-[#5c4a3d] mb-10 uppercase">Record Residence Information</h1>

          <div className="space-y-8">
            {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2"><i className="fa-solid fa-circle-check"></i> {successMsg}</div>}
            {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i> {errorMsg}</div>}

            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Contract Information</h3>
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1.5 ml-1">Choose Contract</label>
                <select value={selectedContractId} onChange={(e) => setSelectedContractId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#cf743b] focus:outline-none bg-white text-gray-700 shadow-sm">
                  <option value="">-- Select Contract ID --</option>
                  {activeContracts.map(hd => (<option key={hd.idHopDong} value={hd.idHopDong}>{hd.idHopDong} - {hd.phieu?.khachHang?.hoTen || "Guest"} ({hd.hinhThuc === 'NGUYEN_PHONG' ? 'Full Room' : 'Shared'})</option>))}
                </select>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs text-gray-500 mb-1.5 ml-1">Full Name</label><input type="text" readOnly value={customerInfo.fullName} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5 ml-1">Phone Number</label><input type="text" readOnly value={customerInfo.phone} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" /></div>
                
                {/* Đã đồng bộ màu sắc và style của Begin Date giống Expired Date */}
                <div>
                  <label className="block text-xs font-bold text-[#cf743b] mb-1.5 ml-1">Begin Date</label>
                  <input type="date" value={formData.beginDate} onChange={(e) => setFormData({...formData, beginDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#cf743b] bg-white outline-none shadow-sm font-semibold text-gray-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#cf743b] mb-1.5 ml-1">Expired Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#cf743b] bg-white outline-none shadow-sm font-semibold text-gray-700" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Room Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs text-gray-500 mb-1.5 ml-1">Room ID</label><input type="text" readOnly value={selectedRoom.idPhong} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5 ml-1">Bed ID</label><input type="text" readOnly value={selectedRoom.idGiuong || 'Room Only'} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" /></div>
              </div>
            </section>

            <div className="flex justify-center gap-6 mt-10">
              <button onClick={() => navigate("/rooms")} className="px-10 py-3 rounded-full border border-[#cf743b] text-[#cf743b] font-bold transition-all hover:bg-[#cf743b]/5">CANCEL</button>
              <button onClick={handleSave} disabled={submitting || !!successMsg} className="px-10 py-3 rounded-full bg-[#cf743b] text-white font-bold shadow-md transition-all active:scale-95 disabled:opacity-50">{submitting ? 'SAVING...' : 'SAVE RECORD'}</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}