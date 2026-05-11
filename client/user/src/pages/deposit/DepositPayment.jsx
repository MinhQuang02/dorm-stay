import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' VND';
}

function getUserId() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      if (payload?.id) {
        return Number(payload.id);
      }
    } catch (error) {
      console.error('Cannot parse token payload:', error);
    }
  }
  return 464;
}

export default function DepositPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CHUYEN_KHOAN');
  const [preview, setPreview] = useState(null);

  const selectedRoom = useMemo(() => {
    const raw = sessionStorage.getItem('selectedRoom');
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError('');

        const userId = getUserId();
        const roomId = selectedRoom?.id || null;

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/deposit/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ userId, roomId })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Cannot load deposit preview.');
        }

        setPreview(data.preview);
      } catch (err) {
        setError(err.message || 'Cannot load deposit preview.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedRoom]);

  const handlePay = async () => {
    if (!preview || !agreed) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const userId = getUserId();
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/deposit/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          userId,
          roomId: preview.roomId,
          bedId: preview.bedId,
          amount: preview.requiredDeposit,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Deposit payment failed.');
      }

      sessionStorage.setItem('depositSuccessInvoice', JSON.stringify(data.invoice));
      navigate('/deposit/success');
    } catch (err) {
      setError(err.message || 'Deposit payment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 mt-12 flex flex-col items-center pb-10">
        <div className="w-full text-center py-24 text-gray-500">Loading deposit data...</div>
      </MainLayout>
    );
  }

  if (error && !preview) {
    return (
      <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 mt-12 flex flex-col items-center pb-10">
        <div className="w-full text-center py-24 text-[#cc6b34] font-semibold">{error}</div>
        <Link to="/deposit" className="mt-4 text-[#cc6b34] text-sm font-bold hover:underline">Back to Deposit</Link>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 mt-12 flex flex-col items-center pb-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-12">
        <div className="w-12 h-12 bg-[#faeddb] rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Deposit Payment</h2>
        <p className="text-sm text-gray-400">
          Review the confirmed rental details below, choose your payment method, and complete the deposit to secure your room or bed at ninth's dormstay.
        </p>
      </div>

      <hr className="w-full max-w-[1000px] border-gray-200 mb-10" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-10">
        {/* Booking Details */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="aspect-[4/3] bg-[#fdf6ed] rounded-2xl relative overflow-hidden flex items-center justify-center">
              <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">Room Preview</span>
              <div className="w-20 h-20 bg-[#faeddb] rounded-full opacity-50"></div>
            </div>
            <div className="aspect-[4/3] bg-white border border-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#cc6b34 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cc6b34" className="w-8 h-8 z-10">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="absolute bottom-4 text-[10px] font-bold text-gray-400">Ninth's Dormstay</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 text-[13px]">
            <div><p className="text-gray-400 mb-1">Room Type</p><p className="font-bold text-gray-800">{preview?.roomType || selectedRoom?.name || 'N/A'}</p></div>
            <div><p className="text-gray-400 mb-1">Bed ID</p><p className="font-bold text-gray-800">{preview?.bedId || 'N/A'}</p></div>
            <div><p className="text-gray-400 mb-1">Deposit Policy</p><p className="font-bold text-gray-800">{preview?.depositMultiplier || 2} months deposit</p></div>
            <div><p className="text-gray-400 mb-1">Number of Guests</p><p className="font-bold text-gray-800">1 guest</p></div>
            <div className="col-span-1"><p className="text-gray-400 mb-1">Address</p><p className="font-bold text-gray-800 leading-relaxed">{selectedRoom?.address || 'N/A'}</p></div>
            <div><p className="text-gray-400 mb-1">Reservation Code</p><p className="font-bold text-gray-800 uppercase">DEP-{preview?.customerId}-{preview?.bedId}</p></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-[#faeddb] rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between"><span className="text-gray-600">Monthly Rent</span><span className="font-bold text-gray-800">{formatCurrency(preview?.bedPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Required Deposit</span><span className="font-bold text-gray-800">{formatCurrency(preview?.requiredDeposit)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Processing Fee</span><span className="font-bold text-gray-800">0 VND</span></div>
              <div className="pt-4 mt-2 border-t border-white/40 flex justify-between items-end">
                <span className="text-gray-600 font-bold">Total to Pay</span>
                <span className="text-2xl font-black text-[#cc6b34]">{formatCurrency(preview?.requiredDeposit)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
            <div className="space-y-3 mb-6">
              <label className={`flex items-center p-4 border rounded-2xl bg-white cursor-pointer group transition-colors ${paymentMethod === 'CHUYEN_KHOAN' ? 'border-[#cc6b34]' : 'border-gray-100'}`}>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-[#faeddb] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">Bank Transfer</p><p className="text-[11px] text-gray-400">Fast confirmation via payment gateway</p></div>
                <input type="radio" name="payment" checked={paymentMethod === 'CHUYEN_KHOAN'} onChange={() => setPaymentMethod('CHUYEN_KHOAN')} className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
              <label className={`flex items-center p-4 border rounded-2xl bg-white cursor-pointer transition-colors ${paymentMethod === 'TIEN_MAT' ? 'border-[#cc6b34]' : 'border-gray-100'}`}>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">Cash</p><p className="text-[11px] text-gray-400">Pay at office and verify immediately</p></div>
                <input type="radio" name="payment" checked={paymentMethod === 'TIEN_MAT'} onChange={() => setPaymentMethod('TIEN_MAT')} className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
              <label className="flex items-center p-4 border border-gray-100 rounded-2xl bg-gray-50 cursor-not-allowed opacity-60">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">E-Wallet</p><p className="text-[11px] text-gray-400">Will be supported soon</p></div>
                <input type="radio" name="payment" disabled className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
            </div>
            <div className="flex items-start gap-2 mb-8">
              <input type="checkbox" id="confirm" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34]" />
              <label htmlFor="confirm" className="text-[11px] text-gray-400 leading-tight">
                I confirm the booking details and agree to proceed to the payment gateway to complete the deposit transaction.
              </label>
            </div>
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handlePay}
                disabled={!agreed || submitting}
                className="w-full py-3 bg-[#cc6b34] disabled:bg-gray-400 text-white text-[13px] font-bold rounded-2xl hover:bg-[#b55e2d] disabled:hover:bg-gray-400 transition-all shadow-md shadow-[#cc6b34]/20 text-center"
              >
                {submitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <Link to="/deposit" className="w-full py-3 bg-white border border-gray-200 text-gray-400 text-[13px] font-bold rounded-2xl hover:bg-gray-50 transition-all text-center">
                Cancel
              </Link>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-4">
              After confirmation, the system will redirect the customer to the external payment gateway and verify the transaction result automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Deadline Banner */}
      <div className="w-full max-w-[1100px] bg-[#faeddb]/50 border border-[#faeddb] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-[13px] font-bold text-gray-900">Deposit deadline</h4>
          <p className="text-[11px] text-gray-500">Please complete the payment within {preview?.expiresInHours || 24} hours to keep the reservation active.</p>
        </div>
        <div className="text-[11px] text-gray-400">
          Status after successful payment: <span className="font-bold text-gray-800">Deposited</span>
        </div>
      </div>
    </MainLayout>
  );
}
