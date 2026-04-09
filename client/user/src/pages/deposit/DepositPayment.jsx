import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositPayment() {
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
            <div><p className="text-gray-400 mb-1">Room Type</p><p className="font-bold text-gray-800">Private Office Room</p></div>
            <div><p className="text-gray-400 mb-1">Check-in Date</p><p className="font-bold text-gray-800">20 April 2026</p></div>
            <div><p className="text-gray-400 mb-1">Rental Duration</p><p className="font-bold text-gray-800">6 months</p></div>
            <div><p className="text-gray-400 mb-1">Number of Guests</p><p className="font-bold text-gray-800">1 guest</p></div>
            <div className="col-span-1"><p className="text-gray-400 mb-1">Address</p><p className="font-bold text-gray-800 leading-relaxed">83 Nguyen Van Cu Street, District 5, Ho Chi Minh City</p></div>
            <div><p className="text-gray-400 mb-1">Reservation Code</p><p className="font-bold text-gray-800 uppercase">ND-DEP-240426</p></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-[#faeddb] rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between"><span className="text-gray-600">Monthly Rent</span><span className="font-bold text-gray-800">7,500,000 VND</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Required Deposit</span><span className="font-bold text-gray-800">3,000,000 VND</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Processing Fee</span><span className="font-bold text-gray-800">0 VND</span></div>
              <div className="pt-4 mt-2 border-t border-white/40 flex justify-between items-end">
                <span className="text-gray-600 font-bold">Total to Pay</span>
                <span className="text-2xl font-black text-[#cc6b34]">3,000,000 VND</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 border border-[#cc6b34] rounded-2xl bg-white cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-[#faeddb] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">Bank Transfer</p><p className="text-[11px] text-gray-400">Fast confirmation via payment gateway</p></div>
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
              <label className="flex items-center p-4 border border-gray-100 rounded-2xl bg-white cursor-pointer hover:border-gray-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">Credit / Debit Card</p><p className="text-[11px] text-gray-400">Visa, MasterCard, and local cards</p></div>
                <input type="radio" name="payment" className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
              <label className="flex items-center p-4 border border-gray-100 rounded-2xl bg-white cursor-pointer hover:border-gray-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#666" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                </div>
                <div className="flex-1"><p className="text-[13px] font-bold text-gray-800">E-Wallet</p><p className="text-[11px] text-gray-400">Momo, ZaloPay, or VNPay wallet</p></div>
                <input type="radio" name="payment" className="w-4 h-4 text-[#cc6b34] focus:ring-[#cc6b34]" />
              </label>
            </div>
            <div className="flex items-start gap-2 mb-8">
              <input type="checkbox" id="confirm" className="mt-0.5 rounded border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34]" />
              <label htmlFor="confirm" className="text-[11px] text-gray-400 leading-tight">
                I confirm the booking details and agree to proceed to the payment gateway to complete the deposit transaction.
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/deposit/success" className="w-full py-3 bg-[#cc6b34] text-white text-[13px] font-bold rounded-2xl hover:bg-[#b55e2d] transition-all shadow-md shadow-[#cc6b34]/20 text-center">
                Proceed to Payment
              </Link>
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
          <p className="text-[11px] text-gray-500">Please complete the payment within 24 hours to keep the reservation active.</p>
        </div>
        <div className="text-[11px] text-gray-400">
          Status after successful payment: <span className="font-bold text-gray-800">Deposited</span>
        </div>
      </div>
    </MainLayout>
  );
}
