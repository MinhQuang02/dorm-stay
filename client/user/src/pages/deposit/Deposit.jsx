import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const reservationDetails = [
  { label: 'Dormitory', value: "ninth's dormstay" },
  { label: 'Address', value: '833 Wilshire Boulevard, Beverly Hills, CA' },
  { label: 'Phone', value: '123456789' },
  { label: 'Check-in date', value: '16 August 2026' },
  { label: 'Rental duration', value: '6 months' },
  { label: 'Number of guests', value: '1 guest' },
  { label: 'Deposit amount', value: '$150.00' },
  { label: 'Status', value: 'Waiting for deposit payment' },
];

export default function Deposit() {
  return (
    <MainLayout title="Deposit Requirement" mainClassName="flex-1 px-6 md:px-12 mt-12 flex flex-col items-center pb-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl">
        <div className="w-12 h-12 bg-[#faeddb] rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385c.148.621-.531 1.114-1.059.777l-4.69-2.97a.563.563 0 0 0-.596 0l-4.69 2.97c-.528.337-1.207-.156-1.059-.777l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your deposit request has been recorded!</h2>
        <p className="text-sm text-gray-400">
          The sale staff has confirmed the room rental details with the customer. Please proceed to the deposit payment step to keep the selected room or bed on hold.
        </p>
      </div>

      <div className="w-full max-w-[800px] mt-12">
        <h3 className="font-bold text-gray-900 text-[15px] mb-4">Reservation summary</h3>

        <div className="space-y-1.5 mb-8 text-[13px]">
          <p><span className="font-bold text-gray-800 w-32 inline-block">Customer:</span> <span className="text-gray-400">Nguyen Minh Phuong</span></p>
          <p><span className="font-bold text-gray-800 w-32 inline-block">Room / Bed:</span> <span className="text-gray-400">Private room · Bed A1</span></p>
          <p><span className="font-bold text-gray-800 w-32 inline-block">Rental condition:</span> <span className="text-gray-400">Eligible for deposit confirmation</span></p>
        </div>

        {/* Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="h-44 rounded-xl overflow-hidden relative bg-gradient-to-r from-[#4d2a17] via-[#8f5a34] to-[#4d2a17] shadow-inner">
            <div className="absolute top-0 right-10 w-10 h-full bg-[#717173]"></div>
            <div className="absolute bottom-6 left-6 w-32 h-16 bg-[#e4d4bd] rounded-sm shadow-md"></div>
            <div className="absolute bottom-16 left-10 w-6 h-10 bg-[#e4b256] rounded-t border-b-0 shadow-md"></div>
            <div className="absolute bottom-10 left-[140px] w-10 h-8 bg-[#ead262] transform rotate-12 rounded-sm shadow-md"></div>
            <div className="absolute bottom-3 left-4 w-12 h-10 bg-[#9ece88] transform -rotate-[15deg] rounded-sm shadow-lg"></div>
          </div>
          <div className="h-44 rounded-xl overflow-hidden relative border border-gray-200">
            <div className="absolute top-0 left-10 w-2 h-full bg-[#d6d6d6]"></div>
            <div className="absolute top-0 left-24 w-2 h-full bg-[#d6d6d6]"></div>
            <div className="absolute top-10 left-0 w-full h-2 bg-[#d6d6d6]"></div>
            <div className="absolute top-24 left-0 w-full h-2 bg-[#d6d6d6]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-md shadow-md text-[10px] font-bold text-gray-600 mb-1 z-10 whitespace-nowrap">833 Wilshire Boulevard</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cc6b34" className="w-6 h-6">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="space-y-4">
          {reservationDetails.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-900">{item.label}</span>
              <span className="text-[13px] text-gray-400">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Next Step */}
        <div className="mt-8 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-[300px]">
            <h4 className="text-[14px] font-bold text-gray-900 mb-1">Next step: Deposit payment</h4>
            <p className="text-[12px] text-gray-400 leading-relaxed">
              This screen supports the use case "Confirm Deposit". After confirmation, the system moves to the deposit payment use case.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/deposit/update" className="flex-1 md:flex-none px-4 py-2.5 bg-[#faeddb] text-[#cc6b34] text-[13px] font-bold rounded-lg hover:bg-[#f2dfc5] transition-colors text-center">
              Update rental info
            </Link>
            <Link to="/deposit/payment" className="flex-1 md:flex-none px-4 py-2.5 bg-[#cc6b34] text-white text-[13px] font-bold rounded-lg hover:bg-[#b55e2d] transition-colors shadow-md shadow-[#cc6b34]/20 text-center">
              Proceed to payment
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-gray-400 max-w-xl">
          Alternative flows supported in this prototype: customer does not agree to deposit, rental information must be updated, or the system fails to record the request.
        </p>
      </div>
    </MainLayout>
  );
}
