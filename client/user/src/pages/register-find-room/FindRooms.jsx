import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function FindRooms() {
  const navigate = useNavigate();
  
  // --- States quản lý dữ liệu ---
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- States quản lý Bộ lọc & Tìm kiếm ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Room Type');
  const [filterPeople, setFilterPeople] = useState(1);
  const [filterPrice, setFilterPrice] = useState('Price');

  // Hàm gọi API lấy danh sách phòng (kèm tham số lọc)
  const fetchRooms = () => {
    setLoading(true);
    // Sử dụng 127.0.0.1 để tránh lỗi phân giải localhost trên một số hệ thống
    const baseUrl = 'http://127.0.0.1:5000/api/booking/search-rooms';
    const params = new URLSearchParams({
      roomType: filterType !== 'Room Type' ? filterType : '',
      people: filterPeople,
      maxPrice: filterPrice !== 'Price' ? filterPrice : ''
    });

    fetch(`${baseUrl}?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        // Nếu có tìm kiếm theo text ở thanh Search Bar (Client-side filter)
        const searchedData = data.filter(room => 
          room.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setRooms(searchedData);
      })
      .catch((err) => console.error("Error fetching rooms:", err))
      .finally(() => setLoading(false));
  };

  // Tự động load dữ liệu khi vào trang lần đầu
  useEffect(() => {
    fetchRooms();
  }, []);

  // Xử lý chọn phòng và lưu vào Session
  const handleSelectRoom = (room) => {
    sessionStorage.setItem('selectedRoom', JSON.stringify(room));
    navigate('/register-booking');
  };

  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-6 md:px-12 py-8 flex flex-col gap-6">
      
      {/* 1. Search Bar */}
      <div className="bg-white rounded-full shadow-sm border border-gray-100 p-2 flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by room name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent" 
          />
        </div>
        <div className="flex items-center gap-4 px-2">
          <button 
            onClick={fetchRooms}
            className="bg-[#1f2937] text-white text-sm font-medium px-8 py-2.5 rounded-full hover:bg-black transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* 2. Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Lọc loại phòng */}
        <select 
          className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[140px] cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>Room Type</option>
          <option value="Master">Master Room</option>
          <option value="Standard">Standard Room</option>
          <option value="Deluxe">Deluxe Room</option>
          <option value="VIP">VIP Room</option>
        </select>

        {/* Lọc số người */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 min-w-[140px]">
          <span className="text-gray-600 text-sm flex-1">People</span>
          <input 
            type="number" 
            min="1" max="10"
            value={filterPeople}
            onChange={(e) => setFilterPeople(e.target.value)}
            className="w-8 outline-none text-sm font-bold text-[#cc6b34] text-right"
          />
        </div>

        {/* Lọc giá (LTE) */}
        <select 
          className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#cc6b34] min-w-[160px] cursor-pointer"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        >
          <option value="Price">Price Range</option>
          <option value="1500000">Under 1.5 million</option>
          <option value="2000000">Under 2.0 million</option>
          <option value="2500000">Under 2.5 million</option>
          <option value="3500000">Under 3.5 million</option>
        </select>

        {/* Reset Filter Button */}
        <button 
          onClick={() => {
            setFilterType('Room Type');
            setFilterPeople(1);
            setFilterPrice('Price');
            setSearchTerm('');
            // Trigger fetch lại
            setTimeout(fetchRooms, 0);
          }}
          className="text-xs text-gray-400 underline hover:text-[#cc6b34]"
        >
          Clear filters
        </button>
      </div>

      {/* 3. Main Content: Grid + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-2 items-start">
        
        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-20 text-center text-gray-400 animate-pulse">Searching for best rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="col-span-2 py-20 text-center text-gray-500">No rooms match your criteria. Try adjusting filters!</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#cc6b34] hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="relative h-48">
                  <img src={room.img} alt="Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-0 right-0 bg-[#fffbeb] text-[#cc6b34] text-xs font-bold px-3 py-1.5 rounded-bl-xl border-b border-l border-[#fde68a]">
                    {room.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{room.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-4 uppercase tracking-wider">{room.address}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5">
                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       {room.people}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Interactive Google Map */}
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
    </MainLayout>
  );
}