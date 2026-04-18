import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const STATUS_CONFIG = {
  PAID:       { label: 'Paid',       bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  PENDING:    { label: 'Pending',    bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  TERMINATED: { label: 'Terminated', bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
};

function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A'; }

export default function Contract() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL | PENDING | PAID | TERMINATED

  const userId = 464; // Replace with Auth context

  useEffect(() => {
    fetch('http://localhost:5000/api/finance/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setContracts(data.contracts || []);
      })
      .catch(() => setError('Unable to connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? contracts : contracts.filter(c => c.paymentStatus === filter);

  const handleContinue = (contract) => {
    sessionStorage.setItem('contractPaymentData', JSON.stringify(contract));
    navigate('/contract/payment');
  };

  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 px-6 md:px-16 py-14 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <h2 className="text-3xl font-bold text-[#333333]">My Contracts</h2>
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-[#faeddb] p-1 rounded-xl">
            {['ALL', 'PENDING', 'PAID', 'TERMINATED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f ? 'bg-[#cc6b34] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {f === 'ALL' ? 'All' : STATUS_CONFIG[f]?.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">Loading contracts...</div>
        )}
        {error && (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">No contracts found for this filter.</div>
        )}

        <div className="flex flex-col gap-6">
          {filtered.map((contract) => {
            const sc = STATUS_CONFIG[contract.paymentStatus] || STATUS_CONFIG.PENDING;
            const canPay = contract.paymentStatus === 'PENDING';
            return (
              <div
                key={contract.contractId}
                className="bg-[#faeddb] rounded-2xl p-6 md:p-8 border border-[#f0e3ce] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Contract Icon */}
                  <div className="w-20 h-20 bg-[#fdecd5] rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                      <path d="M25 25H55C68.807 25 80 36.193 80 50C80 63.807 68.807 75 55 75H25V25Z" fill="#F97316"/>
                      <path d="M25 25L55 55H25V25Z" fill="#3B82F6"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-[#cc6b34] font-bold text-lg">
                        Contract <span className="text-gray-600">#{contract.contractId}</span>
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {sc.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-sm">
                      {[
                        { label: 'Owner', value: contract.customerName },
                        { label: 'Creator', value: contract.creatorName },
                        { label: 'Form of Rental', value: contract.rentalForm },
                        { label: 'Room Type', value: contract.roomType },
                        { label: 'Start Date', value: fmtDate(contract.startDate) },
                        { label: 'End Date', value: fmtDate(contract.endDate) },
                        { label: 'Payment Period', value: contract.paymentPeriod === '1_THANG' ? 'Monthly' : contract.paymentPeriod },
                        { label: 'Amount Due', value: <span className={canPay ? 'text-red-600 font-extrabold' : 'text-green-600 font-bold'}>{fmt(contract.totalAmount)}</span> },
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-xs text-gray-400 font-bold mb-1">{item.label}</p>
                          <p className="text-gray-800 font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-2 flex-shrink-0 self-center md:self-start">
                    {canPay ? (
                      <button
                        onClick={() => handleContinue(contract)}
                        className="bg-[#cc6b34] hover:bg-[#b55e2d] text-white font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        Pay Now
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    ) : (
                      <span className={`text-xs font-bold px-4 py-3 rounded-xl text-center ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
