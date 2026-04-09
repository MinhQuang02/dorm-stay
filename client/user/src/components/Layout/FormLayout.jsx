import Header from './Header';

export default function FormLayout({ children, title }) {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex justify-center">
      <div className="w-[calc(100%-210px)] max-w-[1600px] bg-[#fafaf9] shadow-2xl relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 px-8 md:px-24 py-12 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
