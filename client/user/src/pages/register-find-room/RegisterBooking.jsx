import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RegisterBooking() {
  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-16 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
        {/* Left - Details */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link to="/register-find" className="hover:bg-gray-200 p-1 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-800">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </Link>
              <h2 className="text-[32px] leading-none font-bold text-gray-900 tracking-tight">Booking details</h2>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 mb-6 pl-10">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                8383 Wilshire Boulevard<br/>Beverly Hills, CA
              </span>
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                40m2
              </span>
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                2-8 people
              </span>
            </div>

            <p className="text-[13px] text-gray-800 leading-relaxed max-w-3xl">
              383 Wilshire is among the largest and most prestigious office properties in Beverly Hills. Known as a legal and entertainment hub, it is strategically located on the corner of Wilshire Blvd and San Vicente Blvd.
            </p>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-3">
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" alt="Main Room" className="w-full h-[380px] object-cover rounded-lg" />
            <div className="grid grid-cols-3 gap-3">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Thumbnail 1" className="w-full h-36 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" alt="Thumbnail 2" className="w-full h-36 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" alt="Thumbnail 3" className="w-full h-36 object-cover rounded-lg" />
            </div>
          </div>

          {/* Space Amenities */}
          <div className="mt-4">
            <h3 className="font-bold text-gray-900 mb-6">Space Amenities</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-800">
              {['Printer','City views','Coffee','Air conditioning','Flat Screen monitors','Modern Furniture'].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Building Amenities */}
          <div className="mt-2 mb-10">
            <h3 className="font-bold text-gray-900 mb-6">Building Amenities</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-800">
              {['Mail delivery','Restaurant','Taxi service','Shops nearby','Bus line','ATMs'].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Sidebar */}
        <div className="sticky top-[100px] bg-[#e9e9e9] rounded-2xl p-8 shadow-sm flex flex-col gap-10">
          <div className="flex items-center gap-5">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-sm" />
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Alexa Rawles</h4>
              <p className="text-sm text-gray-500 mt-0.5">alexarawles@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between border-b border-gray-300 pb-8">
            <div className="flex items-center gap-4 text-gray-900 font-semibold text-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/></svg>
              1234567890
            </div>
            <div className="flex items-center gap-4 text-gray-900 font-semibold text-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              abc@gmail.com
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Please select a date to view the room</p>
            <div className="flex gap-4 mb-5">
              <div className="flex-1 border border-gray-400 bg-[#fdfdfd] rounded-xl px-3 py-1.5 flex flex-col justify-center">
                <label className="text-[10px] text-gray-800 font-medium leading-tight">Date</label>
                <input type="text" defaultValue="28.08.2022" className="outline-none text-sm w-full bg-transparent border-none mt-0.5 text-gray-900 font-medium" readOnly />
              </div>
              <div className="w-24 border border-gray-400 bg-[#fdfdfd] rounded-xl px-3 py-1.5 flex flex-col justify-center">
                <label className="text-[10px] text-gray-800 font-medium leading-tight">Guests</label>
                <input type="text" defaultValue="4" className="outline-none text-sm w-full bg-transparent border-none mt-0.5 text-gray-900 font-medium" readOnly />
              </div>
            </div>

            <Link to="/register-success" className="w-full bg-[#262626] text-white py-3.5 rounded-lg text-sm font-bold tracking-wider hover:bg-black transition-colors shadow-md block text-center">
              CONFIRM
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
