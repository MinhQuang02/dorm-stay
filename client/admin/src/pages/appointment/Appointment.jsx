import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Appointment() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Make an Appointment" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col">
      <div className="bg-[#f3f4f6] rounded-[24px] p-6 md:p-10 shadow-sm flex-1 flex flex-col">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <h2 className="text-lg md:text-[20px] font-bold text-black uppercase tracking-wide">
                  ROOM VIEWING APPOINTMENT MANAGEMENT
              </h2>
              
              <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 min-w-[200px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full" />
                  </div>

                  <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-400">Sorted by :</span>
                      <span className="text-sm font-semibold text-gray-800">Newest</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-600 ml-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                  </div>

                  <button className="bg-white p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                      </svg>
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto w-full">
              <table className="w-full text-left whitespace-nowrap">
                  <thead>
                      <tr className="text-gray-400 text-[13px] font-medium border-b border-transparent">
                          <th className="pb-4 font-medium px-2">Customer ID</th>
                          <th className="pb-4 font-medium px-2">Customer Name</th>
                          <th className="pb-4 font-medium px-2">Phone Number</th>
                          <th className="pb-4 font-medium px-2">Email</th>
                          <th className="pb-4 font-medium px-2">Proposed Date</th>
                          <th className="pb-4 font-medium px-2">Action</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm">
                      <tr className="hover:bg-white/40 transition-colors rounded-lg">
                          <td className="py-5 px-2 font-medium text-gray-800">CUS0012</td>
                          <td className="py-5 px-2 text-gray-800">John Doe</td>
                          <td className="py-5 px-2 text-gray-800">0901234567</td>
                          <td className="py-5 px-2 text-gray-800">jane@microsoft.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">CUS0015</td>
                          <td className="py-5 px-2 text-gray-800">Yahoo</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">floyd@yahoo.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">CUS0016</td>
                          <td className="py-5 px-2 text-gray-800">Adobe</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">ronald@adobe.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">CUS0017</td>
                          <td className="py-5 px-2 text-gray-800">Tesla</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">marvin@tesla.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">CUS0018</td>
                          <td className="py-5 px-2 text-gray-800">Google</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">jerome@google.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">Kathryn Murphy</td>
                          <td className="py-5 px-2 text-gray-800">Microsoft</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">kathryn@microsoft.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">Jacob Jones</td>
                          <td className="py-5 px-2 text-gray-800">Yahoo</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">jacob@yahoo.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                      <tr className="hover:bg-white/40 transition-colors">
                          <td className="py-5 px-2 font-medium text-gray-800">Kristin Watson</td>
                          <td className="py-5 px-2 text-gray-800">Facebook</td>
                          <td className="py-5 px-2 text-gray-800">0901234590</td>
                          <td className="py-5 px-2 text-gray-800">kristin@facebook.com</td>
                          <td className="py-5 px-2 text-gray-800">05/15/2026</td>
                          <td className="py-5 px-2">
                              <button onClick={() => navigate('/appointment/register')} className="text-[#cc6b34] border border-[#f0dfc8] bg-white px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-[#faeddb] transition-colors">SCHEDULE</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="mt-8 flex justify-end items-center gap-1.5 text-[13px] text-gray-500">
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">&lt;</button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#cc6b34] text-white font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">3</button>
              <span className="px-1">..</span>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">4</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">&gt;</button>
          </div>
      </div>
    </MainLayout>
  );
}
