import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const tableRows = [
  { no: '1.', name: 'Deposit Payment', desc: 'The money received from the termination of the contract', type: 'REFUND', amount: '10.000.000đ' },
  { no: '2.', name: 'Deposit Detection', desc: 'The amount deducted from the basic deposit refund provision in the contract.', type: 'DETECTION', amount: '-3.000.000đ' },
  { no: '3.', name: 'Water Debt', desc: 'The water bill was still unpaid last month.', type: 'DETECTION', amount: '-200.000đ' },
  { no: '4.', name: 'Electricity Debt', desc: 'The electricity bill was unpaid in December.', type: 'DETECTION', amount: '-500.000đ' },
  { no: '5.', name: 'Property Damage', desc: "The amount of money that needs to be paid for damaging the apartment's table.", type: 'DETECTION', amount: '-2.000.000đ' },
];

export default function DepositOut() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mocking userId for demonstration purposes
  const userId = 464; // Testing simulated data

  useEffect(() => {
    fetch('http://localhost:5000/api/finance/deposit-out/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center"><div className="w-full text-center py-20 text-gray-500">Loading financial data...</div></MainLayout>;
  if (!data || data.error) return <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center"><div className="w-full text-center py-20 text-[#cc6b34] font-bold">{data?.error || "Error loading finance data"}</div></MainLayout>;

  // Build rows dynamically
  const tableRows = [
    { no: '1.', name: 'Deposit Payment', desc: 'The money received from the termination of the contract', type: 'REFUND', amount: `${data.initialDeposit.toLocaleString('vi-VN')}đ` },
  ];

  if (data.breachFee > 0) {
    tableRows.push({ no: '2.', name: 'Deposit Deduction', desc: data.reason, type: 'DEDUCTION', amount: `-${data.breachFee.toLocaleString('vi-VN')}đ` });
  }
  if (data.unpaidBills > 0) {
    tableRows.push({ no: '3.', name: 'Unpaid Bills', desc: 'Unpaid periodic payments and invoices', type: 'DEDUCTION', amount: `-${data.unpaidBills.toLocaleString('vi-VN')}đ` });
  }
  if (data.damageCosts > 0) {
    tableRows.push({ no: '4.', name: 'Property Damage', desc: 'Costs assessed from inspection records', type: 'DEDUCTION', amount: `-${data.damageCosts.toLocaleString('vi-VN')}đ` });
  }

  const handleNext = () => {
    // Store calculation results in sessionStorage to pass to the next page safely
    sessionStorage.setItem('depositOutData', JSON.stringify(data));
    
    if (data.isDebt) {
      navigate('/deposit-out/debt');
    } else {
      navigate('/deposit-out/get-deposit');
    }
  };

  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Contract Info */}
        <div className="bg-[#f4ebe1] p-8 md:p-10 rounded-2xl shadow-sm border border-[#ede1d1] flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          <div className="w-48 h-48 bg-[#fdecd5] rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute w-24 h-24 bg-[#eb7734] rounded-r-full right-4 top-12"></div>
            <div className="absolute w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-[#4285f4] top-12 left-8 origin-bottom rotate-[30deg]"></div>
            <div className="absolute w-20 h-12 bg-[#2b6cf0] bottom-10 left-10 transform -skew-x-[30deg]"></div>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-[#cc6b34] font-bold text-xl mb-6">
              Contract Code: <span className="text-gray-500 font-semibold">{data.contractId ? `#${data.contractId}` : 'N/A'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
              {[
                { label: 'Owner', value: <span>{data.customerName} <span className="text-[#cc6b34]">(+{data.roomId ? 5 : 0})</span></span> },
                { label: 'Creator', value: data.creatorName },
                { label: 'Contract Status', value: data.contractStatus === 'TERMINATED' ? 'Terminated' : 'Deposit can be refunded' },
                { label: 'Form of Rental', value: data.rentalForm },
                { label: 'Start Date', value: data.startDate ? new Date(data.startDate).toLocaleDateString('vi-VN') : 'N/A' },
                { label: 'Payment Period', value: data.paymentPeriod === '1_THANG' ? 'Every Month' : data.paymentPeriod },
                { label: 'Creation Date', value: data.creationDate ? new Date(data.creationDate).toLocaleDateString('vi-VN') : 'N/A' },
                { label: 'End Date', value: data.endDate ? new Date(data.endDate).toLocaleDateString('vi-VN') : 'N/A' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-500 font-semibold mb-1">{item.label}</p>
                  <p className="text-sm text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[60px_200px_1fr_200px_150px] bg-[#faeddb] rounded-t-xl py-4 px-6 border border-[#f0dfc8] text-xs font-bold text-gray-500">
              <div className="text-center">NO.</div>
              <div>COST NAME</div>
              <div>DESCRIPTION</div>
              <div className="text-center">REFUND OR DEDUCTION?</div>
              <div className="text-right">AMOUNT</div>
            </div>
            <div className="bg-white border-x border-b border-[#f0dfc8] rounded-b-xl px-6">
              {tableRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-[60px_200px_1fr_200px_150px] py-6 ${i < tableRows.length - 1 ? 'border-b border-gray-100' : ''} items-center`}>
                  <div className="text-sm font-bold text-gray-800 text-center">{row.no}</div>
                  <div className="text-sm font-bold text-gray-800">{row.name}</div>
                  <div className="text-sm text-gray-400 font-medium pr-4">{row.desc}</div>
                  <div className={`text-sm font-bold text-center ${row.type === 'REFUND' ? 'text-green-600' : 'text-red-500'}`}>{row.type}</div>
                  <div className={`text-sm font-bold text-right ${row.type === 'REFUND' ? 'text-gray-800' : 'text-red-500'}`}>{row.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-4 mb-10 px-6">
          <div className="flex items-center gap-6">
            <span className="text-gray-800 font-bold text-sm">TOTAL {data.isDebt ? 'DEBT' : 'REFUND'}:</span>
            <span className={`font-bold text-lg ${data.isDebt ? 'text-red-600' : 'text-green-600'}`}>
              {data.isDebt ? '-' : ''}{data.finalBalance.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center gap-4">
          <Link to="/deposit-out/complaint" className="bg-[#faeddb] text-[#cc6b34] font-semibold text-sm px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#f2dfc5] transition-colors border border-[#f0dfc8]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 transform -rotate-45 -mt-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            Send Comments
          </Link>
          <button onClick={handleNext} className="bg-[#cc6b34] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#b55e2d] transition-colors shadow-md">
            Agreed and continue
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
