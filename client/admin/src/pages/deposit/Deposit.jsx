import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Deposit() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Deposit Term Confirmation" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
          
          <div className="mb-10">
              <h2 className="text-xl font-bold text-black mb-4">1.Customer & Room Information</h2>
              
              <div className="bg-[#f7ece0] border border-[#ebd7c2] rounded-[24px] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  
                  <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Personal Info</span>
                          <span className="text-[15px] font-bold text-black">Nguyen Van A</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Gender</span>
                          <span className="text-[15px] font-bold text-black">Man</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Desired Area</span>
                          <span className="text-[15px] font-bold text-black">District 10 or 5</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Budget</span>
                          <span className="text-[15px] font-bold text-black">5.000.000 - 6.000.000 VND</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Special Preferences</span>
                          <span className="text-[15px] font-bold text-black leading-snug">Free Curfew, Quiet Area, Parking Spot,<br />AC Equipped</span>
                      </div>
                  </div>

                  <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Phone Number</span>
                          <span className="text-[15px] font-bold text-black">0977 048 547</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Expected Occupants</span>
                          <span className="text-[15px] font-bold text-black">Studio with Balcony</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Room Type</span>
                          <span className="text-[15px] font-bold text-black">2 Persons</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Move-In Date & Term</span>
                          <span className="text-[15px] font-bold text-black">15/05/2026 - 12 Months</span>
                      </div>
                  </div>

              </div>
          </div>

          <div className="mb-10">
              <h2 className="text-xl font-bold text-black mb-4">2.Rental Terms & Conditions</h2>
              
              <div className="bg-[#f7ece0] border border-[#ebd7c2] rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
                  
                  <div>
                      <p className="text-[12px] font-semibold text-gray-500 mb-1.5">1. Deposit Amount & Deadline</p>
                      <p className="text-[14px] font-bold text-black leading-snug">
                          The deposit is calculated as 2 months' rent multiplied by the number of rented beds. Payment must be completed within 24 hours of the request.
                      </p>
                  </div>

                  <div>
                      <p className="text-[12px] font-semibold text-gray-500 mb-1.5">2. Move-in Requirements</p>
                      <p className="text-[14px] font-bold text-black leading-snug">
                          Tenants must satisfy all dorm regulations. If a tenant fails to meet these conditions, the management reserves the right to refuse signing the lease contract.
                      </p>
                  </div>

                  <div>
                      <p className="text-[12px] font-semibold text-gray-500 mb-1.5">3. Refund Policy</p>
                      <div className="text-[14px] font-bold text-black leading-snug">
                          <p>- Canceled before contract signing: 80% refund.</p>
                          <p>- Early termination (stayed &lt; 6 months): 50% refund.</p>
                          <p>- Early termination (stayed ≥ 6 months): 70% refund.</p>
                          <p>- Completed lease term: 100% refund.</p>
                      </div>
                  </div>

                  <div>
                      <p className="text-[12px] font-semibold text-gray-500 mb-1.5">4. Deductions & Liabilities</p>
                      <p className="text-[14px] font-bold text-black leading-snug">
                          Any unpaid rent, utility debts, or property damages will be deducted from the refund amount.
                      </p>
                  </div>

              </div>
          </div>

          <div className="flex flex-col gap-4">
              <h3 className="font-bold text-black text-[15px]">Target Room / Bed</h3>
              
              <div className="flex flex-wrap items-center gap-4">
                  <div className="relative w-[280px]">
                      <select className="w-full appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-2.5 text-gray-500 text-[14px] outline-none">
                          <option>Room 301 - Studio (whole room)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                  </div>
                  <button className="bg-white border border-[#faeddb] text-[#cc6b34] font-bold text-[14px] px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors">
                      Check Availabbility
                  </button>
              </div>

              <div className="mt-1">
                  <div className="bg-[#faeddb] border border-[#f0dfc8] text-black font-bold text-[14px] px-5 py-3 rounded-md inline-block">
                      Room 301 is available. Ready to confirm.
                  </div>
              </div>

              <div className="bg-[#f2f2f2] border-[2px] border-dashed border-[#d1d1d1] rounded-lg p-5 flex items-center gap-5 mt-6">
                  <input type="checkbox" className="custom-checkbox shrink-0" />
                  <span className="text-[14px] font-bold text-black">I verify that the customer meets all conditions and agrees to the terms above.</span>
              </div>

              <div className="mt-6 flex justify-center">
                  <button onClick={() => navigate('/')} className="bg-[#ce7641] text-white font-bold text-[15px] px-12 py-4 rounded-xl shadow-sm hover:bg-[#b55e2d] transition-colors tracking-wide">
                      CONFIRM AGREEMENT & PROCEED TO DEPOSIT
                  </button>
              </div>
          </div>

      </div>
    </MainLayout>
  );
}
