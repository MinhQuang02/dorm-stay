import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Record() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Record Residence Information" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center">
      <div className="w-full bg-[#f6f6f6] rounded-[24px] shadow-sm border border-gray-100 p-8 md:p-10 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-wide">ROOM LIST</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="flex items-center bg-white rounded-lg px-4 py-2.5 w-full sm:w-64 shadow-sm border border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[13px] ml-3 w-full text-gray-700 placeholder-gray-400" />
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 min-w-[160px] cursor-pointer shadow-sm border border-gray-100">
                      <span className="text-[13px] text-gray-500">Short by : <span className="text-gray-800 font-semibold">Newest</span></span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                  </div>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                      <tr className="text-[13px] text-gray-400 font-medium">
                          <th className="pb-6 font-medium w-[10%]">Room ID</th>
                          <th className="pb-6 font-medium w-[15%]">Room Type</th>
                          <th className="pb-6 font-medium text-center w-[15%]">Capacity</th>
                          <th className="pb-6 font-medium w-[25%]">Price</th>
                          <th className="pb-6 font-medium w-[15%]">Status</th>
                          <th className="pb-6 font-medium w-[20%] text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody className="text-[13px] text-gray-800 font-medium">
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R101</td>
                          <td className="py-5">Standard</td>
                          <td className="py-5 text-center">2</td>
                          <td className="py-5">1,200,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R205</td>
                          <td className="py-5">Bunk Bed</td>
                          <td className="py-5 text-center">6</td>
                          <td className="py-5">1,500,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R208</td>
                          <td className="py-5">Deluxe</td>
                          <td className="py-5 text-center">3</td>
                          <td className="py-5">2,250,000 VNĐ/tháng</td>
                          <td className="py-5">Occupied</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R303</td>
                          <td className="py-5">Standard</td>
                          <td className="py-5 text-center">3</td>
                          <td className="py-5">1,400,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R402</td>
                          <td className="py-5">Deluxe</td>
                          <td className="py-5 text-center">4</td>
                          <td className="py-5">2,700,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R405</td>
                          <td className="py-5">Standard</td>
                          <td className="py-5 text-center">2</td>
                          <td className="py-5">1,200,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R503</td>
                          <td className="py-5">Bunk Bed</td>
                          <td className="py-5 text-center">4</td>
                          <td className="py-5">1,320,000 VNĐ/tháng</td>
                          <td className="py-5">Occupied</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-transparent hover:bg-gray-50 transition-colors">
                          <td className="py-5">R601</td>
                          <td className="py-5">Standard</td>
                          <td className="py-5 text-center">3</td>
                          <td className="py-5">1,400,000 VNĐ/tháng</td>
                          <td className="py-5">Available</td>
                          <td className="py-5 text-center">
                              <button onClick={() => navigate('/record/register')} className="bg-[#faeddb] text-[#d58047] uppercase text-[11px] font-bold px-5 py-2 rounded border border-[#efd9c2] hover:bg-[#f2dfc5] transition-colors tracking-wide">
                                  Record
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="flex justify-end items-center gap-1.5 mt-8 text-xs font-medium">
              <button className="w-6 h-6 flex justify-center items-center text-gray-400 hover:bg-gray-200 rounded transition-colors">&lt;</button>
              <button className="w-6 h-6 flex justify-center items-center bg-[#d58047] text-white rounded">1</button>
              <button className="w-6 h-6 flex justify-center items-center text-gray-500 hover:bg-gray-200 rounded transition-colors">2</button>
              <button className="w-6 h-6 flex justify-center items-center text-gray-500 hover:bg-gray-200 rounded transition-colors">3</button>
              <span className="w-4 h-6 flex justify-center items-end text-gray-400 pb-1.5">..</span>
              <button className="w-6 h-6 flex justify-center items-center text-gray-500 hover:bg-gray-200 rounded transition-colors">4</button>
              <button className="w-6 h-6 flex justify-center items-center text-gray-400 hover:bg-gray-200 rounded transition-colors">&gt;</button>
          </div>

      </div>
    </MainLayout>
  );
}
