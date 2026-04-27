// import { Link } from 'react-router-dom';
// import MainLayout from '../../components/Layout/MainLayout';

// const rooms = [
//   { img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', name: 'Beverly Hills, CA', address: '8383 Wilshire Boulevard', price: '1,1 triệu/tháng' },
//   { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', name: 'Federal Plaza, NY', address: '305 Broadway', price: '1,3 triệu/tháng' },
//   { img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', name: 'Albany, NY', address: '890 State St 7th Floor', price: '1,1 triệu/tháng' },
//   { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', name: 'Washington', address: '800 Connecticut Ave NW', price: '1,1 triệu/tháng' },
//   { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', name: 'Beverly Hills, CA', address: '8383 Wilshire Boulevard', price: '1,1 triệu/tháng' },
//   { img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', name: 'Federal Plaza, NY', address: '305 Broadway', price: '1,1 triệu/tháng' },
// ];

// export default function FindRooms() {
//   return (
//     <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-12 py-8 flex flex-col gap-6">
//       {/* Search Bar */}
//       <div className="bg-white rounded-full shadow-sm border border-gray-100 p-2 flex items-center justify-between">
//         <div className="flex items-center gap-3 px-4 flex-1">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
//           </svg>
//           <input type="text" placeholder="Find an office near you" className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent" />
//         </div>
//         <div className="flex items-center gap-4 px-2">
//           <a href="#" className="text-sm font-medium text-gray-800 hover:text-[#cc6b34]">Search Nearby</a>
//           <Link to="/register-booking" className="bg-[#1f2937] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-black transition-colors">
//             Search
//           </Link>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-4">
//         <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[120px] appearance-none cursor-pointer">
//           <option>Area</option>
//         </select>
//         <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[120px] appearance-none cursor-pointer">
//           <option>Room Type</option>
//         </select>
//         <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 min-w-[120px]">
//           <span className="text-gray-600 text-sm flex-1">People</span>
//           <span className="text-gray-800 text-sm font-medium mr-2">1</span>
//           <div className="flex flex-col">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-800"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-800"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
//           </div>
//         </div>
//         <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[120px] appearance-none cursor-pointer">
//           <option>Price</option>
//         </select>
//         <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[120px] appearance-none cursor-pointer">
//           <option>Gender</option>
//         </select>
//         <input type="text" placeholder="Utilities" className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] flex-1 min-w-[150px]" />
//       </div>

//       {/* Room Grid + Map */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-2 items-start">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {rooms.map((room, i) => (
//             <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <div className="relative h-48">
//                 <img src={room.img} alt="Room" className="w-full h-full object-cover" />
//                 <div className="absolute top-0 right-0 bg-[#fffbeb] text-[#cc6b34] text-xs font-bold px-3 py-1.5 rounded-bl-xl border-b border-l border-[#fde68a]">
//                   {room.price}
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3 className="font-bold text-gray-900 text-lg mb-1">{room.name}</h3>
//                 <p className="text-xs text-gray-500 mb-4">{room.address}</p>
//                 <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
//                   <span className="flex items-center gap-1.5">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
//                     2-8 people
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
//                     5.215 sf
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Map */}
//         <div className="sticky top-28 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px] relative">
//           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map View" className="w-full h-full object-cover opacity-30 grayscale blur-[1px]" />
//           {[{top:'20%',left:'30%'},{top:'40%',left:'15%'},{top:'25%',right:'25%'},{top:'45%',right:'35%'},{bottom:'35%',right:'20%'}].map((pos, i) => (
//             <svg key={i} className="absolute w-8 h-8 text-[#eab308] drop-shadow-md" style={pos} viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
//             </svg>
//           ))}
//         </div>
//       </div>
//     </MainLayout>
//   );
// }


import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function FindRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách phòng trống
  useEffect(() => {
    fetch('http://localhost:5000/api/booking/search-rooms')
      .then(r => r.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Error fetching rooms:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectRoom = (room) => {
    sessionStorage.setItem('selectedRoom', JSON.stringify(room));
    navigate('/register-booking');
  };

  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-12 py-8 flex flex-col gap-6">
      {/* Search Bar & Filters (Giữ nguyên giao diện của bạn) */}
      <div className="bg-white rounded-full shadow-sm border border-gray-100 p-2 flex items-center justify-between">
        {/* ... Search Bar Content ... */}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading available rooms...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-2 items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#cc6b34] cursor-pointer transition-all"
              >
                <div className="relative h-48">
                  <img src={room.img} alt="Room" className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-[#fffbeb] text-[#cc6b34] text-xs font-bold px-3 py-1.5 rounded-bl-xl">
                    {room.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{room.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{room.address}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                    <span>{room.people}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Image (Giữ nguyên) */}
          {/* Map - Phần bên phải màn hình */}
          {/* Map - Thay thế ảnh tĩnh bằng Google Maps thật */}
          <div className="sticky top-28 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15678.928013745626!2d106.65804522577353!3d10.755125733304403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zSG9tc3RheSBn4bqnbiDEkcOieQ!5e0!3m2!1sen!2s!4v1777285361139!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Homestay"
            ></iframe>
          </div>
        </div>
      )}
    </MainLayout>
  );
}