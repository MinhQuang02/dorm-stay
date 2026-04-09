import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Request() {
  return (
    <MainLayout title="Move-out Request" mainClassName="flex-1 px-6 md:px-12 py-12 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Section 1 */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-black mb-4">1. Current Contract Information</h2>
          <div className="bg-[#f8eedf] border border-[#e8dccb] rounded-[2rem] p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 shadow-sm">
            <div>
              <p className="text-[13px] text-gray-500 font-semibold mb-2 uppercase tracking-wide">CONTRACT ID</p>
              <p className="font-bold text-[17px] text-black">HD-2025-0012</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-500 font-semibold mb-2 uppercase tracking-wide">ROOM / BED</p>
              <p className="font-bold text-[17px] text-black">Room 301 - Studio</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-500 font-semibold mb-2 uppercase tracking-wide">NAME</p>
              <p className="font-bold text-[17px] text-black">Nguyen Van A</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-500 font-semibold mb-2 uppercase tracking-wide">CONTRACT PERIOD</p>
              <p className="font-bold text-[17px] text-black">15/05/2025 - 15/05/2026</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-black mb-4">2. Move-out Details</h2>
          <h3 className="text-lg font-bold text-black mb-3">Expected Move-out Date (*)</h3>
          <div className="border border-gray-400 rounded-lg p-2 w-full bg-white shadow-sm hover:border-gray-500 transition-colors">
            <label className="block text-[10px] text-gray-600 ml-1 leading-none">Date</label>
            <input type="text" defaultValue="28.08.2022" className="w-full outline-none text-gray-800 text-[15px] bg-transparent ml-1 mt-1 font-medium" />
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-black mb-4">3. Reason / Additional Notes</h2>
          <textarea
            className="w-full h-48 border-2 border-[#cc6b34] rounded-[2rem] p-6 text-gray-800 text-[15px] outline-none resize-none bg-white shadow-sm focus:ring-4 focus:ring-[#faeddb] transition-all"
            placeholder="Please enter your reason or any additional requests (if any)..."
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-center pb-8">
          <Link to="/" className="bg-[#cc6b34] text-white font-semibold py-4 px-10 rounded-2xl shadow-md hover:bg-[#b55e2d] hover:shadow-lg transition-all w-full max-w-[500px] text-lg text-center">
            SUBMIT Move-out Request
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
