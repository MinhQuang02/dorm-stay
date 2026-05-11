import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const services = [
  {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    text: '1. Fill out the registration form and perform a room search.',
    link: '/register-form',
    name: 'Registration Form Room Search'
  },
  {
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    text: '2. Deposit feature and deposit payment processing.',
    link: '/deposit',
    name: 'Deposit Payment'
  },
  {
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
    text: '3. This feature allows you to make payments for contract fees.',
    link: '/payment',
    name: 'Contract Fees Payment'
  },
  {
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    text: '4. Submit a request to leave after the contract expires.',
    link: '/request',
    name: 'Request to Leave'
  },
  {
    img: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=600&q=80',
    text: '5. Pay or debit the amounts related to the deposit.',
    link: '/deposit-out',
    name: 'Deposit Refund Debit'
  },
  {
    img: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    text: '6. Additional features and services may be added in the future.',
    link: '#',
    name: 'Future Services'
  },
];

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-[calc(100%-210px)] max-w-[1600px] bg-[#fafaf9] shadow-2xl relative flex flex-col min-h-screen">
        <Header title="Homepage" />

        <main className="flex-1 px-6 md:px-12 py-10">
          {/* Title & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">Choose the service you want.</h2>
            <div className="relative w-full md:w-64">
              <div className="bg-[#faeddb] px-4 py-2.5 rounded-xl flex items-center gap-3 border border-[#f0dfc8]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search service" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-[#cc6b34] placeholder-[#d18e66] w-full font-medium" 
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              
              {/* Autocomplete Suggestions */}
              {searchQuery && filteredServices.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f0dfc8] rounded-xl shadow-xl z-20 overflow-hidden">
                  {filteredServices.map((service, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-3 hover:bg-[#faeddb] cursor-pointer transition-colors border-b border-[#f0dfc8] last:border-0"
                      onClick={() => setSearchQuery(service.name)}
                    >
                      <p className="text-sm font-bold text-gray-700">{service.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{service.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, i) => (
                <div key={i} className="bg-[#fbf5ee] p-4 rounded-2xl border border-[#f0e4d4] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                  <img src={service.img} alt={service.name} className="w-full h-52 object-cover rounded-xl mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[15px] font-bold text-[#cc6b34] mb-1">{service.name}</h4>
                      <p className="text-[13px] text-gray-600 leading-snug">{service.text}</p>
                    </div>
                    <Link to={service.link} className="bg-[#dab273] text-white p-2.5 rounded-xl hover:bg-[#c69d5f] transition-colors flex-shrink-0 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 4.5 7.5 7.5-7.5 7.5m-6-15 7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 italic">No services matching "{searchQuery}" found.</p>
              </div>
            )}
          </div>

          {/* See More */}
          <div className="mt-10 flex justify-center">
            <button className="bg-[#faeddb] text-[#cc6b34] font-semibold px-10 py-2.5 rounded-lg border border-[#f0dfc8] hover:bg-[#f2dfc5] transition-colors">
              See more
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
