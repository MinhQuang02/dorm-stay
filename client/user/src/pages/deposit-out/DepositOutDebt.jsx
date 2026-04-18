import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositOutDebt() {
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
      } else alert("Failed to process payment data.");
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
          <div className="space-y-10">
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-4">Pay With:</p>
              <div className="flex items-center gap-6">
                {['Card', 'Bank', 'Transfer'].map((method, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pay" defaultChecked={method === 'Transfer'} className="w-4 h-4 text-[#cc6b34] border-gray-300 focus:ring-0" />
                    <span className={`text-[13px] ${method === 'Transfer' ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* QR + Bank Info */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-8 w-full">
                <div className="w-40 h-40 bg-white border-4 border-[#2d3a89] p-2 rounded-sm shadow-sm flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NinthDormstay" alt="QR Code" className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 mb-2">Transfer {data.finalBalance.toLocaleString('vi-VN')}đ to:</p>
                  <p className="text-[14px] font-bold text-gray-800">Vietcombank</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[18px] font-bold text-gray-900 tracking-tight">0123456781</p>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-10">
                Expires in <span className="text-red-500 font-bold">10:00</span> minutes
              </p>
            </div>

            <div className="pt-2">
              <button disabled={loading} onClick={handleFinalize} className="w-full bg-[#ce713b] text-white font-bold text-[13px] py-4 rounded-md shadow-md hover:bg-[#b55e2d] block text-center disabled:bg-gray-400">
                {loading ? 'Confirming...' : 'Confirm Payment'}
              </button>
              <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Deposit Summary */}
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
              <p className="text-[13px] font-bold text-gray-800">Total Debt</p>
              <p className="text-4xl font-bold text-red-600 tracking-tight">{data.finalBalance.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
