import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Residency() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Residency Verification" mainClassName="flex-1 px-6 md:px-12 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
          <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4">1. Booking & Tenant Verification</h2>
              
              <div className="bg-[#f7ece0] border border-[#ebd7c2] rounded-[24px] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  
                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Deposit Status</span>
                      <span className="text-[16px] font-bold text-black">DEP-2026-0045</span>
                  </div>

                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Booking Type</span>
                      <span className="text-[16px] font-bold text-black">Group Booking</span>
                  </div>

                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Name</span>
                      <span className="text-[16px] font-bold text-black">Nguyen Van A</span>
                  </div>

                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">ID Document No.</span>
                      <span className="text-[16px] font-bold text-black">079123456789</span>
                  </div>

                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Room & Allowed Capacity</span>
                      <span className="text-[16px] font-bold text-black">Room 301 - Max 4 Persons</span>
                  </div>

                  <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Area / Gender Rules</span>
                      <span className="text-[16px] font-bold text-black">Male Only Area</span>
                  </div>

              </div>
          </div>

          <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4">2. Mandatory Checklist for Move-in</h2>
              
              <div className="bg-transparent border-[3px] border-[#c48756] rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
                  
                  <div className="flex items-start gap-4">
                      <div className="mt-1 w-[18px] h-[18px] bg-[#e6ece6] flex items-center justify-center rounded-[3px] shrink-0 border border-[#d0dfd0]">
                          <svg className="w-3.5 h-3.5 text-[#5ea65c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                      </div>
                      <p className="text-[15px] leading-relaxed text-black">
                          <span className="font-bold">ID & Residency Data:</span> Verified original ID cards/Passports and collected necessary residency data for ALL occupants.
                      </p>
                  </div>

                  <div className="flex items-start gap-4">
                      <div className="mt-1 w-[18px] h-[18px] bg-[#e6ece6] flex items-center justify-center rounded-[3px] shrink-0 border border-[#d0dfd0]">
                          <svg className="w-3.5 h-3.5 text-[#5ea65c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                      </div>
                      <p className="text-[15px] leading-relaxed text-black">
                          <span className="font-bold">Occupant Count Valid:</span> The actual number of people moving in matches the booked beds and does NOT exceed the room's maximum capacity.
                      </p>
                  </div>

                  <div className="flex items-start gap-4">
                      <div className="mt-1 w-[18px] h-[18px] bg-[#e6ece6] flex items-center justify-center rounded-[3px] shrink-0 border border-[#d0dfd0]">
                          <svg className="w-3.5 h-3.5 text-[#5ea65c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                      </div>
                      <p className="text-[15px] leading-relaxed text-black">
                          <span className="font-bold">Dorm Rules Met:</span> All occupants strictly comply with the registered gender restrictions and specific area regulations.
                      </p>
                  </div>

              </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button onClick={() => navigate('/')} className="w-full sm:w-auto px-10 py-3.5 rounded-2xl border border-[#cd6b33] text-[#cd6b33] font-bold text-[15px] hover:bg-[#faeddb] transition-colors">
                  Deny / Adjust Members
              </button>
              <button onClick={() => navigate('/')} className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#ce7641] text-white font-bold text-[15px] hover:bg-[#b55e2d] transition-colors shadow-sm">
                  All Conditions Met - Proceed to Contract
              </button>
          </div>
      </div>
    </MainLayout>
  );
}
