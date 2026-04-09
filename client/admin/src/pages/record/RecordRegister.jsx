import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RecordRegister() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Record Residence Information" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-[#f6f6f6] rounded-[24px] shadow-sm border border-gray-100 p-8 md:p-12 relative mt-4">
          
          <h2 className="text-xl md:text-2xl font-bold text-[#5a5043] text-center uppercase tracking-wide mb-10">
              RECORD RESIDENCE INFORMATION
          </h2>

          <form action="#" method="POST">
              
              <div className="mb-8">
                  <h3 className="text-gray-700 font-medium text-[14px] mb-4">Customer Information:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Full Name</label>
                          <input type="text" defaultValue="John Doe" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-400 text-[13px] focus:outline-none focus:border-gray-300 shadow-sm" />
                      </div>
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Phone</label>
                          <input type="text" defaultValue="0901234567" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-400 text-[13px] focus:outline-none focus:border-gray-300 shadow-sm" />
                      </div>
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Begin date</label>
                          <input type="text" defaultValue="05/04/2026" className="w-full bg-white border border-[#d58047] rounded-lg px-4 py-3.5 text-gray-700 text-[13px] focus:outline-none shadow-sm" />
                      </div>
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Number of people</label>
                          <input type="text" defaultValue="4" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-400 text-[13px] focus:outline-none focus:border-gray-300 shadow-sm" />
                      </div>
                  </div>
              </div>

              <div className="mb-10">
                  <h3 className="text-gray-700 font-medium text-[14px] mb-4">Room Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Room ID</label>
                          <input type="text" defaultValue="R101" readOnly className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-400 text-[13px] outline-none shadow-sm cursor-default" />
                      </div>
                      <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5 ml-1">Room Type</label>
                          <input type="text" defaultValue="Standard" readOnly className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-400 text-[13px] outline-none shadow-sm cursor-default" />
                      </div>
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-14">
                  <button onClick={() => navigate('/record')} type="button" className="w-full sm:w-[190px] bg-white text-black uppercase text-[12px] font-bold px-8 py-3.5 rounded-full border border-[#d58047] hover:bg-orange-50 transition-colors tracking-widest shadow-sm">
                      CANCEL
                  </button>
                  <button onClick={() => navigate('/record')} type="button" className="w-full sm:w-[190px] bg-[#d58047] text-white uppercase text-[12px] font-bold px-8 py-3.5 rounded-full hover:bg-[#c06f3b] transition-colors tracking-widest shadow-sm">
                      SAVE RECORD
                  </button>
              </div>

          </form>

      </div>
    </MainLayout>
  );
}
