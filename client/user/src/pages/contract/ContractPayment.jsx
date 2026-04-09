import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const summaryItems = [
  { title: '1. Periodic Rent', desc: 'The recurring monthly payment as per the contract.', amount: '2.000.000đ', period: '5/1-5/2' },
  { title: '2. Electricity Bill', desc: 'Monthly electricity bill details as stated in the contract.', amount: '200.000đ', period: '5/12-5/2' },
  { title: '3. Water Fee', desc: 'Monthly water bills as detailed in the contract.', amount: '300.000đ', period: '5/1-5/2' },
  { title: '4. Parking fee', desc: 'Monthly parking fees are as detailed in the contract.', amount: '500.000đ', period: '4/1-5/2' },
  { title: '5. Service fee', desc: 'Monthly service fees are as detailed in the contract.', amount: '500.000đ', period: '5/1-5/2' },
];

export default function ContractPayment() {
  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 px-8 md:px-16 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left - Payment */}
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
                <input type="radio" name="pay_method" defaultChecked /> Bank
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex items-center gap-8">
              <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ContractPayment" alt="QR Code" className="w-32 h-32" />
              </div>
              <div className="text-gray-400 text-sm">
                <p>Transfer 4.300.000đ to:</p>
                <p className="text-black font-bold text-base mt-1">Vietcombank</p>
                <div className="flex items-center gap-2">
                  <p className="text-black font-bold text-lg">0123456781</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 cursor-pointer hover:text-[#cc6b34]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-10">Expires in <span className="text-red-500 font-bold">10:00</span> minutes</p>

            <Link to="/contract/success" className="w-full bg-[#cc6b34] text-white font-bold py-3 px-6 rounded-lg mt-6 hover:bg-[#b55e2d] transition-all shadow-md block text-center">
              Confirm Payment
            </Link>

            <p className="text-[11px] text-gray-400 mt-6 leading-relaxed text-center">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
            </p>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="flex flex-col border-l border-gray-200 pl-0 lg:pl-16">
          <h2 className="text-xl font-bold text-black mb-8">Contract Summary</h2>
          <div className="space-y-8">
            {summaryItems.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="font-bold text-black text-[15px]">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black text-[15px]">{item.amount}</p>
                  <p className="text-[10px] text-gray-400">{item.period}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-300 mt-12 mb-6" />
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-black">Total</p>
            <p className="text-3xl font-bold text-black">3.500.000đ</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
