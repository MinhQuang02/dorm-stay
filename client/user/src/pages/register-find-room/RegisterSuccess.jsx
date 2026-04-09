import MainLayout from '../../components/Layout/MainLayout';

export default function RegisterSuccess() {
  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 flex flex-col items-center py-16 px-6">
      {/* Success Icon */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 bg-[#fdf5e9] rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-[32px] font-bold text-gray-900 mb-3">Your booking is confirmed!</h2>
        <p className="text-gray-500 text-center max-w-md leading-relaxed">
          Our staff will contact you soon to confirm and send the detailed viewing schedule.
        </p>
      </div>

      {/* Details */}
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Private office</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900 mr-2">Adress</span> 8383 Wilshire Boulevard Beverly Hills, CA
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900 mr-2">Phone</span> 123456789
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="h-56 rounded-2xl overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" alt="Room" className="w-full h-full object-cover" />
          </div>
          <div className="h-56 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Location Map" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">Date of your meeting</span>
            <span className="text-gray-500">16 August 2020</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">Number of guests</span>
            <span className="text-gray-500">4 people</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
