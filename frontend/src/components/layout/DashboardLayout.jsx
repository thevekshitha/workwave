import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isTeamSetupPage = location.pathname === '/team-setup';
  const hasNoTeam = !user?.teamId && !isTeamSetupPage;

  return (
    <div className="min-h-screen bg-premium-beige">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        
        {hasNoTeam && (
          <div className="mx-4 lg:mx-8 mt-4 bg-premium-gold/10 border border-premium-gold/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-premium-gold/20 p-2 rounded-xl text-premium-gold">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="font-bold text-premium-black text-sm">No Team Workspace Found</p>
                <p className="text-xs text-premium-gray">You need to create or join a team to see your team's updates and blockers.</p>
              </div>
            </div>
            <Link 
              to="/team-setup" 
              className="flex items-center gap-2 px-4 py-2 bg-premium-black text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
            >
              Set up Team <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
