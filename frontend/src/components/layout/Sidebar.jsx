import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Calendar, Users, AlertCircle, BarChart3, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Stand-up Feed', path: '/feed' },
    { icon: AlertCircle, label: 'Blockers', path: '/blockers' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-premium-lightGray z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-premium-black p-2 rounded-xl">
                <Layout className="text-white" size={24} />
              </div>
              <span className="font-bold text-lg tracking-tight">WORKWAWE</span>
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-premium-black text-white shadow-lg shadow-black/10' 
                      : 'text-premium-gray hover:bg-premium-beige hover:text-premium-black'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-premium-lightGray space-y-2">
            <div className="px-4 py-2 bg-premium-beige/50 rounded-xl">
              <p className="text-[10px] font-bold text-premium-gray uppercase tracking-widest">Team ID</p>
              <p className="text-xs font-mono truncate text-premium-black">
                {user?.teamId || 'No team joined'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-premium-gray hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
