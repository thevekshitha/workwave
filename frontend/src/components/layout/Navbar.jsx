import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-premium-lightGray sticky top-0 z-30 px-4 lg:px-8">
      <div className="h-full flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-premium-beige rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-3 bg-premium-beige/50 border border-premium-lightGray px-4 py-2 rounded-xl w-64 lg:w-96">
            <Search size={18} className="text-premium-gray" />
            <input 
              type="text" 
              placeholder="Search updates, members..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <button className="relative p-2.5 hover:bg-premium-beige rounded-xl transition-all">
            <Bell size={20} className="text-premium-gray" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-premium-gold rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-10 w-[1px] bg-premium-lightGray mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-premium-black">{user?.name}</p>
              <p className="text-xs text-premium-gray capitalize">{user?.role}</p>
            </div>
            <div className="h-10 w-10 bg-premium-black rounded-xl flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
