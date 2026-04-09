import { Link } from 'react-router-dom';

export default function Header({ title }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="sticky top-0 z-50 bg-[#faeddb] rounded-b-3xl px-6 md:px-12 py-4 grid grid-cols-[auto_1fr_auto] items-center shadow-sm transition-all">
      <div className="flex-shrink-0">
        <Link to="/">
          <img src="/logo.svg" alt="Logo" className="h-10 md:h-12 object-contain" />
        </Link>
      </div>

      <h1 className="hidden md:block text-center text-[#cc6b34] font-['Playfair_Display'] text-3xl font-bold tracking-wide translate-x-[40px]">
        {title}
      </h1>

      <div className="flex items-center gap-6 justify-end">
        <a href="mailto:mphanquang06@gmail.com" className="text-sm font-medium text-gray-600 hover:text-[#cc6b34] transition-colors hidden sm:block">
          Contact us
        </a>
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="bg-[#cc6b34] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
              {user.username}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#cc6b34] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b55e2d] transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
