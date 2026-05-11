import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

export default function RecordResidence() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin phòng từ trang Room List truyền sang
  const selectedRoom = location.state?.selectedRoom || null;

  // States quản lý dữ liệu
  const [activeContracts, setActiveContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    idKhachHang: null
  });
  const [formData, setFormData] = useState({
    beginDate: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay
    numberOfPeople: "",
  });

  // 1. Tải danh sách hợp đồng khi mở trang
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/contracts/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setActiveContracts(data.data);
        }
      } catch (err) {
        console.error("Lỗi tải hợp đồng:", err);
      }
    };

    if (selectedRoom) {
      fetchContracts();
    } else {
      navigate("/rooms");
    }
  }, [selectedRoom, navigate]);

  // 2. LOGIC QUAN TRỌNG: Khi ID Hợp đồng thay đổi -> Tự tìm Khách hàng
  useEffect(() => {
    if (selectedContractId) {
      // Tìm hợp đồng trong danh sách đã tải
      const contract = activeContracts.find(c => c.idHopDong === parseInt(selectedContractId));
      
      if (contract && contract.chiTiets && contract.chiTiets.length > 0) {
        // Lấy thông tin khách hàng từ ChiTiet đầu tiên của hợp đồng đó
        const firstDetail = contract.chiTiets[0];
        const kh = firstDetail.khachHang;
        
        setCustomerInfo({
          fullName: kh.hoTen || "N/A",
          phone: kh.sdt || "N/A",
          idKhachHang: kh.idKhachHang
        });
        
        // Có thể tự điền luôn số người dựa trên sức chứa phòng nếu cần
        setFormData(prev => ({ ...prev, numberOfPeople: selectedRoom.sucChua }));
      }
    } else {
      setCustomerInfo({ fullName: "", phone: "", idKhachHang: null });
    }
  }, [selectedContractId, activeContracts, selectedRoom]);

  const handleSave = async () => {
    if (!selectedContractId || !customerInfo.idKhachHang) {
      alert("Vui lòng chọn hợp đồng để lấy thông tin khách hàng!");
      return;
    }

    const contract = activeContracts.find(c => c.idHopDong === parseInt(selectedContractId));
    const isFullRoom = contract?.hinhThuc === 'NGUYEN_PHONG';
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/contracts/residence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idKhachHang: customerInfo.idKhachHang,
          idHopDong: parseInt(selectedContractId),
          idGiuong: selectedRoom.idGiuong,
          idPhong: selectedRoom.idPhong, // Đã bổ sung idPhong
          isFullRoom: isFullRoom,        // Đã bổ sung isFullRoom
          thongTinCT: `Bắt đầu từ: ${formData.beginDate} - ${isFullRoom ? 'Thuê nguyên phòng' : 'Thuê giường lẻ'}`
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Ghi nhận cư trú thành công!");
        navigate("/rooms");
      } else {
        alert(data.message || "Lỗi khi lưu dữ liệu.");
      }
    } catch (err) {
      alert("Lỗi kết nối server.");
    }
  };

  if (!selectedRoom) return null;

  return (
    <MainLayout title="Record Residence Information">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbfbfa] py-10 px-4">
        <div className="w-full max-w-3xl bg-[#fafafa] rounded-2xl shadow-sm border border-gray-100 p-10">
          <h1 className="text-2xl font-bold text-center text-[#5c4a3d] mb-10 uppercase">
            Record Residence Information
          </h1>

          <div className="space-y-8">
            {/* 1. Chọn Hợp đồng */}
            <div>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Contract:</h3>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#cf743b] focus:outline-none bg-white text-gray-700"
              >
                <option value="">-- Choose Contract ID --</option>
                {activeContracts.map(c => (
                  <option key={c.idHopDong} value={c.idHopDong}>
                    #{c.idHopDong} - {c.hinhThuc === 'NGUYEN_PHONG' ? 'Thuê nguyên phòng' : 'Ở ghép'}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Customer Information - Đã xóa ô "Số người" */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Customer Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Full Name</label>
                  <input type="text" readOnly value={customerInfo.fullName} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Phone</label>
                  <input type="text" readOnly value={customerInfo.phone} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Begin date</label>
                  <input
                    type="date"
                    value={formData.beginDate}
                    onChange={(e) => setFormData({...formData, beginDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#cf743b] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Room Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Room Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Room ID</label>
                  <input type="text" readOnly value={selectedRoom.idPhong} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Bed ID</label>
                  <input type="text" readOnly value={selectedRoom.idGiuong} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-10">
              <button onClick={() => navigate("/rooms")} className="px-10 py-3 rounded-full border border-[#cf743b] text-[#cf743b] font-bold">CANCEL</button>
              <button onClick={handleSave} className="px-10 py-3 rounded-full bg-[#cf743b] text-white font-bold shadow-md">SAVE RECORD</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}