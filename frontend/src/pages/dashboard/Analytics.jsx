import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie, 
  Sector,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Calendar,
  AlertTriangle,
  Zap,
  Target,
  Trophy,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [blockerData, setBlockerData] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchData = async () => {
      try {
        // In a real app, you'd have an analytics endpoint
        // const res = await api.get('/analytics');
        
        // Mock data for Weekly Engagement
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        setEngagementData(days.map(day => ({
          name: day,
          updates: Math.floor(Math.random() * 15) + 5
        })));

        // Mock data for Monthly Completion Rate
        const months = ['Jan', 'Feb', 'Mar', 'Apr'];
        setCompletionData(months.map(month => ({
          name: month,
          rate: Math.floor(Math.random() * 20) + 75
        })));

        // Mock data for Blocker Frequency
        setBlockerData([
          { name: 'Technical', value: 45 },
          { name: 'Design', value: 25 },
          { name: 'Dependencies', value: 20 },
          { name: 'Personal', value: 10 }
        ]);

        // Mock contributors
        setContributors([
          { name: 'Alex Johnson', updates: 24, color: '#D4AF37' },
          { name: 'Sarah Williams', updates: 21, color: '#3b82f6' },
          { name: 'Michael Chen', updates: 18, color: '#a855f7' },
          { name: 'Emma Davis', updates: 15, color: '#22c55e' },
        ]);

      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Team Efficiency', 
      value: '92%', 
      trend: '+5.2%', 
      isUp: true, 
      icon: Zap, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      description: 'Based on update frequency'
    },
    { 
      label: 'Completion Rate', 
      value: '87%', 
      trend: '+2.1%', 
      isUp: true, 
      icon: Target, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      description: 'Monthly average'
    },
    { 
      label: 'Active Blockers', 
      value: '3', 
      trend: '-2', 
      isUp: true, 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-100',
      description: 'Pending resolution'
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-premium-black tracking-tight">Team Analytics</h1>
          <p className="text-premium-gray mt-1">Comprehensive reports on team performance and engagement.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-premium-lightGray shadow-sm">
          <button className="px-4 py-2 text-xs font-bold bg-premium-black text-white rounded-lg">Last 30 Days</button>
          <button className="px-4 py-2 text-xs font-bold text-premium-gray hover:bg-premium-beige rounded-lg transition-colors">Last 90 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="premium-card group hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {stat.isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-premium-gray text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-premium-black mt-1">{stat.value}</h3>
            <p className="text-[10px] text-premium-gray font-bold uppercase tracking-widest mt-2">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-premium-black">Submission Trends</h3>
              <p className="text-xs text-premium-gray mt-1 font-medium">Daily activity for the current month</p>
            </div>
            <div className="flex items-center gap-2 bg-premium-beige/50 px-3 py-1.5 rounded-xl border border-premium-lightGray/50">
              <Activity size={14} className="text-premium-gold" />
              <span className="text-[10px] font-bold text-premium-black uppercase tracking-wider">Active</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#D4AF37' }}
                  cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="updates" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSub)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-premium-black">Blocker Distribution</h3>
              <p className="text-xs text-premium-gray mt-1 font-medium">Analysis of team obstacles</p>
            </div>
            <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100">
              <Zap size={20} />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F9F7F2' }}
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#D4AF37" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {blockerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 15 ? '#EF4444' : '#D4AF37'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-premium-black">Top Contributors</h3>
              <p className="text-xs text-premium-gray mt-1 font-medium">Most active members this week</p>
            </div>
            <Trophy size={20} className="text-premium-gold" />
          </div>
          <div className="space-y-6">
            {contributors.map((member, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-10 w-10 bg-premium-beige rounded-xl flex items-center justify-center font-bold text-premium-black group-hover:bg-premium-gold group-hover:text-white transition-all duration-300">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-premium-black">{member.name}</span>
                    <span className="text-xs font-bold text-premium-gold">{member.updates} Updates</span>
                  </div>
                  <div className="h-2 w-full bg-premium-beige rounded-full overflow-hidden border border-premium-lightGray/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(member.updates / 25) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                      className="h-full bg-gradient-to-r from-premium-gold to-premium-black rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="premium-card flex flex-col items-center justify-center text-center py-10"
        >
          <div className="relative mb-6">
            <div className="h-40 w-40 rounded-full border-[10px] border-premium-beige flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-black text-premium-black block">88%</span>
                <span className="text-[10px] font-bold text-premium-gray uppercase tracking-widest">Team Health</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-12 w-12 bg-white rounded-2xl shadow-premium flex items-center justify-center border border-premium-lightGray/50">
              <Target size={24} className="text-premium-gold" />
            </div>
          </div>
          <h4 className="font-bold text-premium-black mb-2">Excellent Progress!</h4>
          <p className="text-xs text-premium-gray px-6 leading-relaxed">
            Your team's completion rate is 12% higher than last week. Keep maintaining this momentum!
          </p>
          <button className="mt-8 px-6 py-2.5 bg-premium-black text-white rounded-xl text-xs font-bold hover:bg-premium-gray transition-all shadow-lg shadow-black/10">
            View Full Report
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
