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

  const [assets, setAssets]       = useState([]);   // TaiSan của phòng
  const [assetRows, setAssetRows] = useState([]);   // Mỗi row: { idTaiSan, tinhTrang, hdSuDung, checked }
  const [noiDung, setNoiDung]     = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [loadingAssets, setLoadingAssets] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [errors, setErrors]               = useState({});
  const [successMsg, setSuccessMsg]       = useState('');

  // ── Load tài sản theo phòng khi có contract ──
  useEffect(() => {
    if (contract?.idPhong) {
      fetchAssets(contract.idPhong);
    }
  }, [contract]);

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
        // Khởi tạo assetRows: mặc định tinhTrang giữ nguyên từ DB, check all
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
    const checkedAssets = assetRows.filter((r) => r.checked);
    if (checkedAssets.length === 0) errs.assets = 'Please select at least one asset.';
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
      <div className="flex-1 px-6 md:px-12 py-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Card Header */}
            <div className="bg-[#faf5ef] px-8 py-5 border-b border-[#f0e8dc]">
              <h2 className="text-center text-lg font-bold text-gray-700 uppercase tracking-widest">
                Record Residence Information
              </h2>
            </div>

            <div className="px-8 py-7 space-y-7">

              {/* Success */}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                    <input type="text" readOnly
                      value={contract?.customerName || '—'}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone</label>
                    <input type="text" readOnly
                      value={'—'}
                      placeholder="0901234567"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Begin date</label>
                    <input type="text" readOnly
                      value={formatDate(contract?.ngayBatDau)}
                      className="w-full px-4 py-2.5 text-sm border border-[#cc6b34] rounded-xl bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Expire date</label>
                    <input type="text" readOnly
                      value={formatDate(contract?.ngayKetThuc)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {/* ── SECTION 2: Room Details ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Room Details
                </h3>
                {errors.contract && <p className="text-xs text-red-500 mb-2">{errors.contract}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Room ID</label>
                    <input type="text" readOnly
                      value={contract ? `R${contract.idPhong}` : '—'}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Room Type</label>
                    <input type="text" readOnly
                      value={contract?.loaiPhong || '—'}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {/* ── SECTION 3: Asset List ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Asset Handover List
                </h3>
                {errors.assets && <p className="text-xs text-red-500 mb-2">{errors.assets}</p>}

                {loadingAssets ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                    <div className="w-4 h-4 border-2 border-[#cc6b34] border-t-transparent rounded-full animate-spin" />
                    Loading assets...
                  </div>
                ) : assets.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">No assets found for this room.</p>
                ) : (
                  <div className="space-y-3">
                    {assetRows.map((row, idx) => {
                      const asset = assets.find((a) => a.idTaiSan === row.idTaiSan);
                      return (
                        <div key={row.idTaiSan}
                          className={`border rounded-xl p-4 transition-all ${
                            row.checked ? 'border-[#f0e8dc] bg-[#faf5ef]' : 'border-gray-100 bg-gray-50 opacity-60'
                          }`}>
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={row.checked}
                              onChange={(e) => handleAssetChange(row.idTaiSan, 'checked', e.target.checked)}
                              className="mt-1 w-4 h-4 accent-[#cc6b34] cursor-pointer flex-shrink-0"
                            />
                            <div className="flex-1 space-y-3">
                              {/* Asset name + type */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">{asset?.tenTaiSan}</p>
                                  <p className="text-xs text-gray-400">{asset?.loaiTaiSan}</p>
                                </div>
                                <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                                  #{row.idTaiSan}
                                </span>
                              </div>

                              {row.checked && (
                                <div className="grid grid-cols-2 gap-3">
                                  {/* Tình trạng */}
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Condition</label>
                                    <select
                                      value={row.tinhTrang}
                                      onChange={(e) => handleAssetChange(row.idTaiSan, 'tinhTrang', e.target.value)}
                                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 bg-white"
                                    >
                                      {TINH_TRANG_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{TINH_TRANG_LABEL[opt]}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* Hướng dẫn sử dụng */}
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Usage Notes</label>
                                    <input
                                      type="text"
                                      value={row.hdSuDung}
                                      onChange={(e) => handleAssetChange(row.idTaiSan, 'hdSuDung', e.target.value)}
                                      placeholder="Optional..."
                                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30"
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

              {/* ── SECTION 4: Notes ── */}
              <section>
                <h3 className="text-xs font-bold text-[#cc6b34] uppercase tracking-widest mb-4">
                  Additional Notes
                </h3>
                <textarea
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  rows={2}
                  placeholder="Any extra information..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc6b34]/30 resize-none"
                />
              </section>

              {/* ── Confirmation Checkbox ── */}
              <div>
                <label className={`flex items-start gap-3 cursor-pointer select-none ${errors.confirmed ? 'text-red-500' : 'text-gray-600'}`}>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => { setConfirmed(e.target.checked); setErrors((p) => ({ ...p, confirmed: '' })); }}
                    className="mt-0.5 w-4 h-4 accent-[#cc6b34] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs leading-relaxed">
                    I confirm that the guest has checked our and I agree to update the room status.
                  </span>
                </label>
                {errors.confirmed && <p className="mt-1 text-xs text-red-500 ml-7">{errors.confirmed}</p>}
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => navigate('/handover')}
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
