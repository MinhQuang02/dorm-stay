import Header from './Header';

export default function MainLayout({ children, title, mainClassName = "flex-1 px-6 md:px-12 py-10", showPadding = true }) {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-[calc(100%-210px)] max-w-[1600px] bg-[#fafaf9] shadow-2xl relative flex flex-col min-h-screen">
        <Header title={title} />
        <main className={mainClassName}>
          {children}
        </main>
      </div>
    </div>
  );
}
