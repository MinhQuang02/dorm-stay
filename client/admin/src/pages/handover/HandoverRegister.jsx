import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function HandoverRegister() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Apartment Handover Record" mainClassName="flex-1 px-6 md:px-12 py-12 flex justify-center items-center">
      <div className="w-full max-w-[760px] bg-[#f5f6f8] rounded-[32px] p-10 md:p-14 shadow-sm border border-gray-200/60 flex flex-col gap-8">
          
          <h2 className="text-xl md:text-[22px] font-bold text-[#564c42] text-center mb-2 tracking-wide">
              RECORD RESIDENCE INFORMATION
          </h2>

          <div className="flex flex-col gap-4">
              <h3 className="text-[15px] text-gray-800 font-medium">Customer Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#cc6b34] text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Phone</label>
                      <input type="text" defaultValue="0901234567" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#cc6b34] text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Begin date</label>
                      <input type="text" defaultValue="05/04/2026" className="px-4 py-3 rounded-xl border border-[#d28b5e] outline-none text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Expire Date</label>
                      <input type="text" defaultValue="20/04/2026" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#cc6b34] text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
              </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-[15px] text-gray-800 font-medium">Room Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Room ID</label>
                      <input type="text" defaultValue="R101" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#cc6b34] text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-[12px] text-gray-500 font-medium">Room Type</label>
                      <input type="text" defaultValue="Standard" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#cc6b34] text-[15px] text-gray-400 bg-white transition-colors" />
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
              <input type="checkbox" id="confirm-checkout" className="w-4 h-4 rounded border-gray-300 text-[#cc6b34] focus:ring-[#cc6b34] cursor-pointer accent-[#cc6b34]" />
              <label htmlFor="confirm-checkout" className="text-[13px] text-gray-600 cursor-pointer font-medium select-none">
                  I confirm that the guest has checked out and I agree to update the room status.
              </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-6">
              <button onClick={() => navigate('/handover')} className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-[30px] border border-[#d28b5e] text-black font-bold text-[14px] hover:bg-[#faeddb] transition-colors">
                  CANCEL
              </button>
              <button onClick={() => navigate('/handover')} className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-[30px] bg-[#ce7641] text-white font-bold text-[14px] hover:bg-[#b55e2d] transition-colors shadow-sm">
                  SAVE RECORD
              </button>
          </div>

      </div>
    </MainLayout>
  );
}
