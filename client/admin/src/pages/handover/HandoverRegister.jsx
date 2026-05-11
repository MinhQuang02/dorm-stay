import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from '../../components/Layout/MainLayout';

const API_BASE = "http://localhost:5000/api";

const TINH_TRANG_OPTIONS = ['BINH_THUONG', 'HOT_HONG', 'CAN_SUA_CHUA', 'DA_THAY_MOI'];
const TINH_TRANG_LABEL   = {
  BINH_THUONG:  'Good',
  HOT_HONG:     'Broken',
  CAN_SUA_CHUA: 'Needs Repair',
  DA_THAY_MOI:  'Replaced',
};

export default function HandoverRegister() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const contract  = location.state?.contract || null;

  const [assets, setAssets]       = useState([]);   
  const [assetRows, setAssetRows] = useState([]);   
  const [noiDung, setNoiDung]     = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [loadingAssets, setLoadingAssets] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [errors, setErrors]               = useState({});
  const [successMsg, setSuccessMsg]       = useState('');

  useEffect(() => {
    if (contract?.idPhong) {
      fetchAssets(contract.idPhong);
    } else {
        // Nếu lỡ vào trang này mà không có data hợp đồng thì quay về list
        navigate('/handover');
    }
  }, [contract, navigate]);

  const fetchAssets = async (idPhong) => {
    try {
      setLoadingAssets(true);
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API_BASE}/handover/assets/${idPhong}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) {
        setAssets(data.data);
        setAssetRows(
          data.data.map((a) => ({
            idTaiSan:  a.idTaiSan,
            tinhTrang: a.tinhTrang || 'BINH_THUONG',
            hdSuDung:  '',
            checked:   true,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleAssetChange = (idTaiSan, field, value) => {
    setAssetRows((prev) =>
      prev.map((row) => (row.idTaiSan === idTaiSan ? { ...row, [field]: value } : row))
    );
  };

  const validate = () => {
    const errs = {};
    if (!contract) errs.contract = 'No contract information.';
    if (!confirmed) errs.confirmed = 'Please confirm before saving.';

    if (assets.length > 0) {
      const checkedAssets = assetRows.filter((r) => r.checked);
      if (checkedAssets.length === 0) errs.assets = 'Please select at least one asset.';
    }
    
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const payload = {
        idHopDong: contract.idHopDong,
        noiDung:   noiDung || null,
        trangThai: 'HOAN_TAT',
        assets: assetRows
          .filter((r) => r.checked)
          .map((r) => ({
            idTaiSan:  r.idTaiSan,
            tinhTrang: r.tinhTrang,
            hdSuDung:  r.hdSuDung || null,
          })),
      };

      const res  = await fetch(`${API_BASE}/handover`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Handover record saved successfully!');
        setTimeout(() => navigate('/handover'), 2000);
      } else {
        setErrors({ submit: data.message || 'An error occurred.' });
      }
    } catch (err) {
      setErrors({ submit: 'Connection error.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  return (
    <MainLayout title="Apartment Handover Record">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbfbfa] py-10 px-4">
        <div className="w-full max-w-3xl bg-[#fafafa] rounded-2xl shadow-sm border border-gray-100 p-10">
          
          <h1 className="text-2xl font-bold text-center text-[#5c4a3d] mb-10 uppercase">
            Apartment Handover Record
          </h1>

          <div className="space-y-8">

            {/* Thông báo lỗi/thành công */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-check"></i> {successMsg}
              </div>
            )}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i> {errors.submit}
              </div>
            )}

            {/* 1. Customer Information */}
            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hàng 1: Tên khách hàng + Mã hợp đồng */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Customer Name</label>
                  <input type="text" readOnly value={contract?.customerName || '—'} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Contract ID</label>
                  <input type="text" readOnly value={contract.idHopDong || '—'} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed" />
                </div>

                {/* Hàng 2: Ngày bắt đầu + Ngày hết hạn */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Begin date</label>
                  <input type="text" readOnly value={formatDate(contract?.ngayBatDau)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Expired date</label>
                  <input type="text" readOnly value={formatDate(contract?.ngayKetThuc)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed" />
                </div>
              </div>
            </section>

            {/* 2. Room Details */}
            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Room Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Room ID</label>
                  <input type="text" readOnly value={contract ? `${contract.idPhong}` : '—'} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 ml-1">Room Type</label>
                  <input type="text" readOnly value={contract?.loaiPhong || '—'} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600" />
                </div>
              </div>
            </section>

            {/* 3. Asset Handover List */}
            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Asset Handover List</h3>
              {errors.assets && <p className="text-xs text-red-500 mb-2 ml-1">{errors.assets}</p>}

              {loadingAssets ? (
                <div className="text-center py-4 text-gray-400 text-sm">Loading assets...</div>
              ) : assets.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm italic">No assets found for this room.</div>
              ) : (
                <div className="space-y-4">
                  {assetRows.map((row) => {
                    const asset = assets.find((a) => a.idTaiSan === row.idTaiSan);
                    return (
                      <div key={row.idTaiSan} 
                        className={`border rounded-xl p-5 transition-all ${
                          row.checked ? 'border-[#faeddb] bg-[#faeddb]/30' : 'border-gray-100 bg-gray-50 opacity-60'
                        }`}>
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={(e) => handleAssetChange(row.idTaiSan, 'checked', e.target.checked)}
                            className="mt-1.5 w-4 h-4 accent-[#cf743b] cursor-pointer"
                          />
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-gray-700">{asset?.tenTaiSan}</p>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider">{asset?.loaiTaiSan} • #{row.idTaiSan}</p>
                              </div>
                            </div>

                            {row.checked && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Condition</label>
                                  <select
                                    value={row.tinhTrang}
                                    onChange={(e) => handleAssetChange(row.idTaiSan, 'tinhTrang', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#cf743b] outline-none bg-white"
                                  >
                                    {TINH_TRANG_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>{TINH_TRANG_LABEL[opt]}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Usage Notes</label>
                                  <input
                                    type="text"
                                    value={row.hdSuDung}
                                    onChange={(e) => handleAssetChange(row.idTaiSan, 'hdSuDung', e.target.value)}
                                    placeholder="Optional..."
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#cf743b] outline-none bg-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 4. Notes */}
            <section>
              <h3 className="text-sm font-semibold text-[#cf743b] mb-4 uppercase">Additional Notes</h3>
              <textarea
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                rows={3}
                placeholder="Any extra information about the handover..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#cf743b] outline-none bg-white text-sm"
              />
            </section>

            {/* Confirmation */}
            <div className="pt-2">
              <label className={`flex items-start gap-3 cursor-pointer select-none ${errors.confirmed ? 'text-red-500' : 'text-gray-600'}`}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => { setConfirmed(e.target.checked); setErrors((p) => ({ ...p, confirmed: '' })); }}
                  className="mt-1 w-4 h-4 accent-[#cf743b] cursor-pointer"
                />
                <span className="text-xs leading-relaxed italic">
                  I confirm that the guest has checked our assets and I agree to update the room status.
                </span>
              </label>
              {errors.confirmed && <p className="mt-1 text-xs text-red-500 ml-7">{errors.confirmed}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-10">
              <button 
                onClick={() => navigate('/handover')} 
                className="px-10 py-3 rounded-full border border-[#cf743b] text-[#cf743b] font-bold transition-all hover:bg-[#cf743b]/5"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting || !!successMsg}
                className="px-10 py-3 rounded-full bg-[#cf743b] text-white font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'SAVING...' : 'SAVE RECORD'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}