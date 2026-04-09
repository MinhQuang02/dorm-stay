import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const summaryItems = [
  { title: '1. Deposit Payment', desc: 'The money received from the termination of the contract', amount: '10.000.000đ', type: 'REFUND' },
  { title: '2. Deposit Detection', desc: 'The money received from the termination of the contract', amount: '-3.000.000đ', type: 'REFUND' },
  { title: '3. Water Debt', desc: 'The money received from the termination of the contract', amount: '-200.000đ', type: 'REFUND' },
  { title: '4. Electricity Debt', desc: 'The money received from the termination of the contract', amount: '-500.000đ', type: 'REFUND' },
  { title: '5. Property Damage', desc: 'The money received from the termination of the contract', amount: '-2.000.000đ', type: 'REFUND' },
];

export default function DepositOutGetDeposit() {
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
              <button className="w-full bg-[#ce713b] text-white font-bold text-[13px] py-4 rounded-md hover:bg-[#b55e2d] transition-all shadow-md">
                Get 4.300.000đ
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
            {summaryItems.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-[13px] font-bold text-gray-800">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-gray-800">{item.amount}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">{item.type}</p>
                </div>
              </div>
            ))}
            <hr className="border-gray-200 my-8" />
            <div className="flex justify-between items-end">
              <p className="text-[13px] font-bold text-gray-800">Total</p>
              <p className="text-3xl font-bold text-gray-900">4.300.000đ</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
