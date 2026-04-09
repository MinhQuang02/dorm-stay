import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function AppointmentRegister() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Make an Appointment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
      <div className="bg-[#f3f4f6] rounded-[24px] p-6 md:p-12 shadow-sm flex-1 flex flex-col items-center justify-center">
          
          <div className="w-full max-w-[700px] flex flex-col gap-8">
              <h2 className="text-xl md:text-[22px] font-bold text-[#544a3e] text-center tracking-wide uppercase">
                  SCHEDULE ROOM VIEWING
              </h2>

              <form className="flex flex-col gap-6">
                  <div>
                      <p className="text-sm font-medium text-gray-700 mb-4">Customer Information:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Full Name</label>
                              <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Phone</label>
                              <input type="text" defaultValue="0901234567" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
                          </div>
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Room to view:</label>
                      <input type="text" defaultValue="Room 101 (District 5 Branch)" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
                  </div>

                  <div>
                      <p className="text-sm font-medium text-gray-700 mb-4">Scheduling Details:</p>
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-5">
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Date</label>
                              <input type="text" defaultValue="28.08.2025 - 28.08.2025" className="w-full px-4 py-3 rounded-lg border border-[#cc6b34] outline-none text-gray-400 text-sm bg-white" />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Time</label>
                              <input type="text" defaultValue="9:00am - 12:00pm" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Guests</label>
                              <input type="text" defaultValue="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-gray-400 text-sm focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]/30 transition-all bg-white" />
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-8">
                      <button onClick={() => navigate('/appointment')} type="button" className="w-[180px] py-3 rounded-full border border-[#cc6b34] bg-white text-black font-bold text-sm tracking-wide hover:bg-[#faeddb] transition-colors">
                          CANCEL
                      </button>
                      <button onClick={() => navigate('/appointment')} type="button" className="w-[180px] py-3 rounded-full border border-[#cc6b34] bg-[#cc6b34] text-white font-bold text-sm tracking-wide hover:bg-[#b55e2d] transition-colors">
                          SAVE & SEND
                      </button>
                  </div>
              </form>
          </div>

      </div>
    </MainLayout>
  );
}
