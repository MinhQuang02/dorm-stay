import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositUpdate() {
  const navigate = useNavigate();
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]";
  const labelClass = "text-[12px] font-semibold text-gray-700";

  const [roomOrBed, setRoomOrBed] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [duration, setDuration] = useState('6');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sel = sessionStorage.getItem('selectedRoom');
    if (sel) {
      const r = JSON.parse(sel);
      setRoomOrBed(r.name || '');
      setPrice(r.price ? r.price.replace(/[^0-9]/g, '') : '');
    }
  }, []);

  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 464;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id || 464;
    } catch (e) { return 464; }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/booking/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          userId: getUserId(),
          room: { name: roomOrBed },
          startDate: checkIn,
          durationMonths: duration,
          price: price
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
      navigate('/deposit');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally { setSubmitting(false); }
  };

  return (
    <MainLayout title="Update Tenant Information" mainClassName="flex-1 px-6 md:px-12 mt-10 flex justify-center pb-10">
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Update Rental Information</h2>
          <p className="text-[13px] text-gray-400">Modify your booking details before deposit payment</p>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Room / Bed</h4><p className="text-[13px] text-gray-500">Current selection or type new</p></div>
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Check-in Date</h4><p className="text-[13px] text-gray-500">Preferred move-in date</p></div>
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Price</h4><p className="text-[13px] text-gray-500">Monthly budget</p></div>
        </div>

        <hr className="border-gray-200 mb-8" />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Room / Bed</label>
              <input value={roomOrBed} onChange={(e) => setRoomOrBed(e.target.value)} type="text" placeholder="Enter new room or bed" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Check-in Date</label>
              <div className="relative">
                <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Rental Duration (months)</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" min="1" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Price</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="$" className={inputClass} />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mt-8 mb-6" />

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <button onClick={handleSubmit} disabled={submitting} className="bg-[#cc6b34] hover:bg-[#b55e2d] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#cc6b34]/20">
            {submitting ? 'Updating...' : 'Submit Update'}
          </button>
          <Link to="/deposit" className="bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-700 text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
