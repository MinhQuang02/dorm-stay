import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const tableRows = [
  { no: '1.', name: 'Deposit Payment', desc: 'The money received from the termination of the contract', type: 'REFUND', amount: '10.000.000đ' },
  { no: '2.', name: 'Deposit Detection', desc: 'The amount deducted from the basic deposit refund provision in the contract.', type: 'DETECTION', amount: '-3.000.000đ' },
  { no: '3.', name: 'Water Debt', desc: 'The water bill was still unpaid last month.', type: 'DETECTION', amount: '-200.000đ' },
  { no: '4.', name: 'Electricity Debt', desc: 'The electricity bill was unpaid in December.', type: 'DETECTION', amount: '-500.000đ' },
  { no: '5.', name: 'Property Damage', desc: "The amount of money that needs to be paid for damaging the apartment's table.", type: 'DETECTION', amount: '-2.000.000đ' },
];

export default function DepositOut() {
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
              Contract Code: <span className="text-gray-500 font-semibold">#2020-05-0001</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
              {[
                { label: 'Owner', value: <span>Phan Quang Minh <span className="text-[#cc6b34]">(+5)</span></span> },
                { label: 'Creator', value: 'Huynh Van Sinh' },
                { label: 'Contract Status', value: 'Deposit can refunded' },
                { label: 'Form of Rental', value: 'By Bed' },
                { label: 'Start Date', value: '20/11/2025' },
                { label: 'Payment Period', value: 'The 5th' },
                { label: 'Creation Date', value: '17/11/2025' },
                { label: 'End Date', value: '26/03/2026' },
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
                  <div className="text-sm font-bold text-gray-800 text-center">{row.type}</div>
                  <div className="text-sm font-bold text-gray-800 text-right">{row.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-4 mb-10 px-6">
          <div className="flex items-center gap-6">
            <span className="text-gray-800 font-bold text-sm">Total Price:</span>
            <span className="text-gray-400 font-medium text-sm">4.300.000đ</span>
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
          <Link to="/deposit-out/get-deposit" className="bg-[#cc6b34] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#b55e2d] transition-colors shadow-md">
            Agreed and continue
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
