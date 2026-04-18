import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const summaryItems = [
  { title: '1. Deposit Payment', desc: 'The money received from the termination of the contract', amount: '10.000.000đ', type: 'REFUND' },
  { title: '2. Deposit Detection', desc: 'The money received from the termination of the contract', amount: '-3.000.000đ', type: 'REFUND' },
  { title: '3. Water Debt', desc: 'The money received from the termination of the contract', amount: '-200.000đ', type: 'REFUND' },
  { title: '4. Electricity Debt', desc: 'The money received from the termination of the contract', amount: '-500.000đ', type: 'REFUND' },
  { title: '5. Property Damage', desc: 'The money received from the termination of the contract', amount: '-2.000.000đ', type: 'REFUND' },
];

export default function DepositOutGetDeposit() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem('depositOutData');
    if (cached) setData(JSON.parse(cached));
    else navigate('/deposit-out');
  }, [navigate]);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/finance/deposit-out/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: data.customerId,
          contractId: data.contractId,
          bedId: data.bedId,
          finalBalance: data.finalBalance,
          isDebt: data.isDebt
        })
      });
      const response = await res.json();
      if(response.success) {
        sessionStorage.setItem('depositOutInvoice', JSON.stringify(response.invoice));
        navigate('/deposit-out/success');
      } else alert("Failed to finalize refund.");
    } catch (e) {
      console.error(e);
      alert("Error contacting server");
    } finally {
      setLoading(false);
    }
  };

  if(!data) return null;

  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-8 md:px-20 py-16 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left - Payment */}
        <div className="pr-0 lg:pr-10">
          <h2 className="text-xl font-bold text-gray-900 mb-10">Payment</h2>
          <div className="space-y-8">
            {/* Pay With */}
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-4">Pay With:</p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="payment_method" className="w-4 h-4 border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34]" />
                  <span className="text-[13px] text-gray-500 group-hover:text-gray-800 transition-colors">Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="payment_method" defaultChecked className="w-4 h-4 border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34]" />
                  <span className="text-[13px] text-gray-800 font-medium">Bank</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="payment_method" className="w-4 h-4 border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34]" />
                  <span className="text-[13px] text-gray-500 group-hover:text-gray-800 transition-colors">Transfer</span>
                </label>
              </div>
            </div>

            {/* Bank Select */}
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-3 px-4 text-sm text-gray-400 bg-white focus:outline-none focus:border-[#cc6b34]">
                <option>Access Bank</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
            </div>

            {/* Account Number */}
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-4">Enter Your Bank Account Number</p>
              <input type="text" placeholder="0123456789" className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm text-gray-600 focus:outline-none focus:border-[#cc6b34]" />
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button onClick={handleFinalize} disabled={loading} className="w-full bg-[#ce713b] text-white font-bold text-[13px] py-4 rounded-md hover:bg-[#b55e2d] transition-all shadow-md disabled:bg-gray-400">
                {loading ? 'Processing...' : `Get ${data.finalBalance.toLocaleString('vi-VN')}đ`}
              </button>
              <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="border-l border-gray-200 pl-0 lg:pl-20">
          <h2 className="text-xl font-bold text-gray-900 mb-10">Deposit Summary</h2>
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <p className="text-[13px] font-bold text-gray-800">1. Deposit Payment</p>
                <p className="text-[11px] text-gray-400 mt-1">The money received from the termination of the contract</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-gray-800">{data.initialDeposit.toLocaleString('vi-VN')}đ</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">REFUND</p>
              </div>
            </div>
            
            {data.breachFee > 0 && (
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-[13px] font-bold text-gray-800">2. Deposit Deduction</p>
                  <p className="text-[11px] text-gray-400 mt-1">{data.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-red-500">-{data.breachFee.toLocaleString('vi-VN')}đ</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">DEDUCTION</p>
                </div>
              </div>
            )}
            
            {data.unpaidBills > 0 && (
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-[13px] font-bold text-gray-800">3. Unpaid Bills</p>
                  <p className="text-[11px] text-gray-400 mt-1">Periodic debt</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-red-500">-{data.unpaidBills.toLocaleString('vi-VN')}đ</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">DEDUCTION</p>
                </div>
              </div>
            )}
            
            {data.damageCosts > 0 && (
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-[13px] font-bold text-gray-800">4. Property Damage</p>
                  <p className="text-[11px] text-gray-400 mt-1">Costs assessed from inspection</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-red-500">-{data.damageCosts.toLocaleString('vi-VN')}đ</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">DEDUCTION</p>
                </div>
              </div>
            )}
            
            <hr className="border-gray-200 my-8" />
            <div className="flex justify-between items-end">
              <p className="text-[13px] font-bold text-gray-800">Total Refund</p>
              <p className="text-3xl font-bold text-green-600">{data.finalBalance.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
