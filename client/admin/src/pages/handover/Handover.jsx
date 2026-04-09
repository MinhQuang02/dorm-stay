import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Handover() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Apartment Handover Record" mainClassName="flex-1 px-6 md:px-12 py-10 flex justify-center">
      <div className="w-full max-w-5xl bg-[#f5f6f8] rounded-[32px] p-8 shadow-sm border border-gray-100">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-lg font-bold text-gray-900 tracking-wide uppercase">ROOM LIST</h2>
              
              <div className="flex gap-4 w-full sm:w-auto">
                  <div className="bg-white px-4 py-2.5 rounded-lg flex items-center gap-2 w-full sm:w-64 border border-gray-100 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#9ca3af" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full font-medium" />
                  </div>

                  <div className="bg-white px-4 py-2.5 rounded-lg flex items-center gap-2 border border-gray-100 shadow-sm cursor-pointer whitespace-nowrap">
                      <span className="text-gray-400 text-sm">Short by :</span>
                      <span className="text-gray-800 text-sm font-semibold">Newest</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#9ca3af" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                  </div>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="text-gray-400 text-sm border-b border-gray-200/70">
                          <th className="pb-4 font-medium pl-2">Room ID</th>
                          <th className="pb-4 font-medium">Customer Name</th>
                          <th className="pb-4 font-medium">Begin Date</th>
                          <th className="pb-4 font-medium">Expired Date</th>
                          <th className="pb-4 font-medium">Status</th>
                          <th className="pb-4 font-medium text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody className="text-[13px] text-gray-800">
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R101</td>
                          <td className="py-6 font-medium">Joe</td>
                          <td className="py-6 font-medium">20/03/2025</td>
                          <td className="py-6 font-medium">20/04/2026</td>
                          <td className="py-6 font-medium">Occupied</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R205</td>
                          <td className="py-6 font-medium">Celine</td>
                          <td className="py-6 font-medium">12/02/2026</td>
                          <td className="py-6 font-medium">20/04/2026</td>
                          <td className="py-6 font-medium">Occupied</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R208</td>
                          <td className="py-6 font-medium">Luke</td>
                          <td className="py-6 font-medium">12/02/2026</td>
                          <td className="py-6 font-medium">20/04/2026</td>
                          <td className="py-6 font-medium">Occupied</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R303</td>
                          <td className="py-6 font-medium">Amily</td>
                          <td className="py-6 font-medium">12/02/2026</td>
                          <td className="py-6 font-medium">12/03/2026</td>
                          <td className="py-6 font-medium">Overdue</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R402</td>
                          <td className="py-6 font-medium">Deluxe</td>
                          <td className="py-6 font-medium">02/01/2026</td>
                          <td className="py-6 font-medium">05/03/2026</td>
                          <td className="py-6 font-medium">Available</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-gray-100/50 transition-colors">
                          <td className="py-6 pl-2 font-medium">R405</td>
                          <td className="py-6 font-medium">Standard</td>
                          <td className="py-6 font-medium">12/02/2026</td>
                          <td className="py-6 font-medium">20/04/2026</td>
                          <td className="py-6 font-medium">Available</td>
                          <td className="py-6 text-center">
                              <button onClick={() => navigate('/handover/register')} className="bg-[#fcf3e8] border border-[#eec5aa] text-[#cc6b34] px-4 py-1.5 rounded-md font-semibold hover:bg-[#faeddb] transition-colors tracking-wide text-xs">RECORD</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="flex justify-end items-center gap-2 mt-8">
              <button className="text-gray-400 hover:text-gray-700 w-6 h-6 flex items-center justify-center text-xs font-medium transition-colors">&lt;</button>
              <button className="bg-[#d4814d] text-white w-6 h-6 rounded flex items-center justify-center text-xs font-semibold shadow-sm">1</button>
              <button className="text-gray-500 hover:bg-gray-200 w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-colors">2</button>
              <button className="text-gray-500 hover:bg-gray-200 w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-colors">3</button>
              <span className="text-gray-400 text-xs tracking-widest px-1">...</span>
              <button className="text-gray-500 hover:bg-gray-200 w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-colors">4</button>
              <button className="text-gray-400 hover:text-gray-700 w-6 h-6 flex items-center justify-center text-xs font-medium transition-colors">&gt;</button>
          </div>

      </div>
    </MainLayout>
  );
}
