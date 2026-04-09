export default function AuthLayout({ children, image, imageAlt, imagePos = "right", maxH = "h-[85vh] max-h-[700px]", noScroll = false }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#e2e8f0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className={`w-full max-w-[1000px] ${maxH} bg-[#f8fafd] flex shadow-2xl rounded-2xl overflow-hidden`}>
        {imagePos === "left" && (
          <div className="hidden md:block w-1/2 relative bg-gray-200 border-r border-gray-100">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
          </div>
        )}

        <div className={`w-full md:w-1/2 flex flex-col items-center ${noScroll ? 'justify-center' : 'justify-start pt-12'} p-8 lg:p-14 relative ${noScroll ? 'overflow-hidden' : 'overflow-y-auto scroll-smooth custom-scrollbar'}`}>
          {children}
        </div>

        {imagePos === "right" && (
          <div className="hidden md:block w-1/2 relative bg-gray-200">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
            {imagePos === "right" && imageAlt === "Hostel Dormitory" && (
              <div className="absolute inset-0 bg-black/10"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
