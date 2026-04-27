import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  FileText,
  Calendar,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teamMembers: 0,
    dailyUpdates: 0,
    activeBlockers: 0,
    completionRate: '0%',
    pendingUpdates: 0
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [updatesRes, blockersRes, membersRes] = await Promise.all([
          api.get('/updates/feed'),
          api.get('/updates/blockers'),
          api.get('/teams/members')
        ]);

        const allUpdates = updatesRes?.data?.data || [];
        const today = new Date().toISOString().split('T')[0];
        const todayUpdates = Array.isArray(allUpdates) ? allUpdates.filter(u => u?.createdAt?.startsWith(today)) : [];
        const totalMembers = membersRes?.data?.data?.length || 0;
        const totalBlockers = Array.isArray(blockersRes?.data?.data) ? blockersRes.data.data.length : 0;
        
        setRecentUpdates(Array.isArray(allUpdates) ? allUpdates.slice(0, 5) : []);
        setStats({
          teamMembers: totalMembers,
          dailyUpdates: todayUpdates.length,
          activeBlockers: totalBlockers,
          completionRate: totalMembers > 0 ? `${Math.round((todayUpdates.length / totalMembers) * 100)}%` : '0%',
          pendingUpdates: Math.max(0, totalMembers - todayUpdates.length)
        });

        // Mock data for the weekly chart
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockChartData = days.map(day => ({
          name: day,
          updates: totalMembers > 0 ? Math.floor(Math.random() * totalMembers) + 1 : 0,
          completion: Math.floor(Math.random() * 40) + 60
        }));
        setChartData(mockChartData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.teamId) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const StatCard = ({ icon: Icon, label, value, trend, color, subtext, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="premium-card hover:translate-y-[-4px] transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
            <TrendingUp size={14} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-premium-gray text-sm font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-premium-black mt-1">{value}</h3>
          {subtext && <span className="text-xs text-premium-gray font-medium">{subtext}</span>}
        </div>
      </div>
    </motion.div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-4 border border-red-100">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-bold text-premium-black mb-2">Oops! Something went wrong</h2>
      <p className="text-premium-gray max-w-md mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="premium-button-primary px-8"
      >
        Try Refreshing
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-premium-black tracking-tight"
          >
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'there'}! 👋
          </motion.h1>
          <p className="text-premium-gray mt-1 font-medium">Here's your team's stand-up summary for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/standup" className="premium-button-primary flex items-center gap-2 shadow-premium hover:shadow-premium-hover transition-all">
            <Plus size={18} /> Submit Update
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Team Members" 
          value={stats.teamMembers} 
          color="bg-blue-600"
          subtext="Total active"
          delay={0.1}
        />
        <StatCard 
          icon={MessageSquare} 
          label="Updates Today" 
          value={stats.dailyUpdates} 
          trend="+12%"
          color="bg-purple-600"
          subtext={`${stats.dailyUpdates}/${stats.teamMembers} submitted`}
          delay={0.2}
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Active Blockers" 
          value={stats.activeBlockers} 
          color="bg-red-600"
          subtext="Require attention"
          delay={0.3}
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completion Rate" 
          value={stats.completionRate} 
          trend="+5%"
          color="bg-green-600"
          subtext="Today's goal"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Productivity Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="premium-card p-6 shadow-premium"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-premium-black">Weekly Productivity</h2>
                <p className="text-sm text-premium-gray font-medium">Stand-up completion rate over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-premium-gold"></div>
                  <span className="text-xs font-bold text-premium-gray uppercase tracking-wider">Completion %</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8f9fa' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="completion" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#D4AF37' : '#E5E7EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-premium-black">Recent Activity</h2>
              <Link to="/feed" className="text-premium-gold font-bold text-sm hover:text-premium-black transition-colors flex items-center gap-1 group">
                View Full Feed <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((update, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    key={update._id || index} 
                    className="premium-card hover:border-premium-gold/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-premium-beige rounded-2xl flex items-center justify-center font-bold text-premium-black border border-premium-lightGray group-hover:bg-premium-gold group-hover:text-white group-hover:border-premium-gold transition-all">
                          {update.userId?.name ? update.userId.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-premium-black">{update.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-premium-gray font-medium">
                            {update.userId?.role || 'Team Member'} • {update.createdAt ? new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${update.blockers ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                          {update.blockers ? 'Blocked' : 'On Track'}
                        </span>
                        <Link to="/feed" className="p-2 hover:bg-premium-beige rounded-xl transition-colors text-premium-gray hover:text-premium-gold">
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em]">Yesterday</p>
                        <p className="text-sm text-premium-black leading-relaxed line-clamp-2">{update.yesterday}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em]">Today</p>
                        <p className="text-sm text-premium-black leading-relaxed font-medium line-clamp-2">{update.today}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="premium-card text-center py-16 border-dashed border-2 flex flex-col items-center justify-center bg-premium-beige/10">
                  <div className="p-5 bg-premium-beige rounded-3xl mb-4 shadow-sm">
                    <FileText className="text-premium-gray" size={32} />
                  </div>
                  <p className="text-premium-black font-bold text-lg">No updates yet today</p>
                  <p className="text-premium-gray text-sm mt-1 font-medium">Be the first to share what you're working on!</p>
                  <Link to="/standup" className="mt-8 premium-button-primary px-8">
                    Start Update
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-premium-black">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/standup" className="flex items-center justify-between p-4 bg-white border border-premium-lightGray rounded-2xl hover:border-premium-gold/50 hover:shadow-premium transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Plus size={20} />
                  </div>
                  <span className="font-bold text-premium-black">Submit Update</span>
                </div>
                <ChevronRight size={18} className="text-premium-gray group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="/feed" className="flex items-center justify-between p-4 bg-white border border-premium-lightGray rounded-2xl hover:border-premium-gold/50 hover:shadow-premium transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Eye size={20} />
                  </div>
                  <span className="font-bold text-premium-black">View Feed</span>
                </div>
                <ChevronRight size={18} className="text-premium-gray group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/blockers" className="flex items-center justify-between p-4 bg-white border border-premium-lightGray rounded-2xl hover:border-premium-gold/50 hover:shadow-premium transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <AlertTriangle size={20} />
                  </div>
                  <span className="font-bold text-premium-black">View Blockers</span>
                </div>
                <ChevronRight size={18} className="text-premium-gray group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Stand-up Summary Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="premium-card bg-premium-black text-white overflow-hidden relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <LayoutDashboard size={100} />
            </div>
            <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
              <TrendingUp size={20} className="text-premium-gold" />
              Team Summary
            </h3>
            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm font-medium">Updates Received</span>
                <span className="font-bold text-lg">{stats.dailyUpdates} <span className="text-white/40 font-normal text-sm">/ {stats.teamMembers}</span></span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm font-medium">Pending Updates</span>
                <span className="font-bold text-lg">{stats.pendingUpdates}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm font-medium">Active Blockers</span>
                <span className="font-bold text-lg text-red-400">{stats.activeBlockers}</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Today's Progress</span>
                  <span className="text-sm font-bold text-premium-gold">{stats.completionRate}</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: stats.completionRate }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-premium-gold h-full" 
                  ></motion.div>
                </div>
                <p className="text-[10px] text-white/40 mt-4 leading-relaxed italic">
                  {parseInt(stats.completionRate) < 100 
                    ? `We need ${stats.pendingUpdates} more updates to hit today's target.` 
                    : "Outstanding! The whole team is in sync today."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;