import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }

export default function ContractPayment() {
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem('contractPaymentData');
    if (!cached) {
      navigate('/contract');
      return;
    }
    setContract(JSON.parse(cached));
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Payment session expired.");
      navigate('/contract');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/finance/contracts/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 464, // Replace with dynamic auth id
          contractId: contract.contractId,
          amount: contract.totalAmount,
          paymentMethod: 'CHUYEN_KHOAN'
        })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('contractSuccessInvoice', JSON.stringify(data.invoice));
        navigate('/contract/success');
      } else {
        alert(data.error || "Payment failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    } finally {
      setLoading(false);
    }
  };

  if (!contract) return null;

  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 px-8 md:px-16 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left - Payment Simulation */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-black mb-4">Contract Payment</h2>
          <hr className="border-gray-300 mb-8" />

          <div className="mb-6">
            <p className="font-bold text-black mb-4">Pay With:</p>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed">
                <input type="radio" name="pay_method" disabled /> Transfer
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed">
                <input type="radio" name="pay_method" disabled /> Card
              </label>
              <label className="flex items-center gap-2 text-sm text-black font-bold cursor-pointer">
                <input type="radio" name="pay_method" defaultChecked /> Bank Transfer (Simulated)
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 p-8 bg-[#faeddb] bg-opacity-30 rounded-3xl border border-[#f0e3ce]">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ContractPay_${contract.contractId}`} alt="QR Code" className="w-40 h-40" />
              </div>
              <div className="text-gray-500 text-sm">
                <p>Transfer <span className="text-sm font-bold text-[#cc6b34]">{fmt(contract.totalAmount)}</span> to:</p>
                <p className="text-black font-bold text-base mt-2">DormStay Central Account</p>
                <p className="text-gray-400 text-xs">Vietcombank - Branch HCM</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-black font-extrabold text-2xl tracking-tighter">099 2810 4401</p>
                  <button className="text-[#cc6b34] hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] mt-4 uppercase font-bold tracking-widest text-gray-400">Description: INV {contract.contractId}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-12 mb-2">Session expires in:</p>
            <p className="text-3xl font-extrabold text-red-500 font-mono mb-8">{formatTime(timeLeft)}</p>

            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#cc6b34] hover:bg-[#b55e2d]'} text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg text-lg`}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>

            <p className="text-[11px] text-gray-400 mt-6 leading-relaxed text-center">
              By clicking confirm, you acknowledge that you have made the transfer. The system will verify and update your status instantly.
            </p>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="flex flex-col border-l border-gray-200 pl-0 lg:pl-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-black">Payment Summary</h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-[#cc6b34] text-xs font-bold hover:underline"
            >
              View Contract Details
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="max-w-[70%]">
                <p className="font-bold text-black text-[15px]">1. Rental Fee (Bed)</p>
                <p className="text-xs text-gray-400 mt-1">Base monthly rent as per contract agreement.</p>
              </div>
              <p className="font-bold text-black text-[15px]">{fmt(contract.bedPrice)}</p>
            </div>

            {contract.serviceCosts.map((s, idx) => (
              <div key={idx} className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="max-w-[70%]">
                  <p className="font-bold text-black text-[15px]">{idx + 2}. {s.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Additional service fee.</p>
                </div>
                <p className="font-bold text-black text-[15px]">{fmt(s.amount)}</p>
              </div>
            ))}

            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="max-w-[70%]">
                <p className="font-bold text-black text-[15px]">{contract.serviceCosts.length + 2}. Utility Management</p>
                <p className="text-xs text-gray-400 mt-1">Electricity, water and facility management fee.</p>
              </div>
              <p className="font-bold text-black text-[15px]">{fmt(contract.utilityEstimate)}</p>
            </div>

            {contract.totalUnpaid > 0 && (
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="max-w-[70%]">
                  <p className="font-bold text-black text-[15px]">{contract.serviceCosts.length + 3}. Overdue Balance</p>
                  <p className="text-xs text-red-500 mt-1">Carried over from previous periods.</p>
                </div>
                <p className="font-bold text-red-600 text-[15px]">{fmt(contract.totalUnpaid)}</p>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-1">Total Payment</p>
                <p className="text-gray-500 text-[11px]">Period: {new Date().toLocaleDateString('vi-VN', {month: 'long', year: 'numeric'})}</p>
              </div>
              <p className="text-3xl font-extrabold text-black">{fmt(contract.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-8 text-[#cc6b34]">Contract # {contract.contractId}</h3>
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <p className="font-bold text-black uppercase">Article 1: Agreement Details</p>
              <p>This rental contract is established between DormStay Management and {contract.customerName} regarding the Room Type: {contract.roomType} (ID: {contract.roomId}) at Bed: {contract.bedId}.</p>
              
              <p className="font-bold text-black uppercase">Article 2: Fees & Payments</p>
              <p>The monthly rental fee is {fmt(contract.bedPrice)}. Additional services include: {contract.serviceCosts.map(s => s.name).join(', ')}. Payments are due monthly as per the contract period.</p>
              
              <p className="font-bold text-black uppercase">Article 3: Terms of stay</p>
              <p>The contract starts on {new Date(contract.startDate).toLocaleDateString('vi-VN')} and ends on {new Date(contract.endDate).toLocaleDateString('vi-VN')}. Early termination is subject to penalties as described in section 5 (Deposit Out Logic).</p>
            </div>
            <button
               onClick={() => setShowModal(false)}
               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl mt-8 transition-all"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
