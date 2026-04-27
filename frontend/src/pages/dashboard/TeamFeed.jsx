import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Search, 
  Calendar, 
  Filter, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  X,
  MessageSquare,
  Clock,
  Layout,
  MoreVertical,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'blockers'
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [updatesRes, membersRes] = await Promise.all([
          api.get('/updates/feed'),
          api.get('/teams/members')
        ]);
        setUpdates(updatesRes?.data?.data || []);
        setMembers(membersRes?.data?.data || []);
      } catch (err) {
        console.error('Error fetching feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.today?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.yesterday?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'blockers' && update.blockers);
    const matchesMember = selectedMember === 'all' || update.userId?._id === selectedMember;
    
    let matchesDate = true;
    if (selectedDate) {
      const updateDate = new Date(update.createdAt).toISOString().split('T')[0];
      matchesDate = updateDate === selectedDate;
    }
    
    return matchesSearch && matchesFilter && matchesMember && matchesDate;
  });

  // Group updates by date
  const groupedUpdates = filteredUpdates.reduce((groups, update) => {
    const date = new Date(update.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(update);
    return groups;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-premium-black tracking-tight">Stand-up Feed</h1>
          <p className="text-premium-gray mt-1 font-medium">Daily updates from your team members.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-gray" size={16} />
            <input 
              type="text"
              placeholder="Search updates..."
              className="premium-input pl-9 py-2 w-48 text-sm focus:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-xl border border-premium-lightGray p-1">
            <div className="relative flex items-center">
              <User className="absolute left-3 text-premium-gray" size={14} />
              <select 
                className="bg-transparent border-none text-xs font-bold text-premium-black pl-8 pr-8 py-1.5 outline-none appearance-none cursor-pointer"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value="all">All Members</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-xl border border-premium-lightGray p-1">
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-premium-gray" size={14} />
              <input 
                type="date"
                className="bg-transparent border-none text-xs font-bold text-premium-black pl-8 pr-3 py-1.5 outline-none cursor-pointer"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate('')}
                  className="mr-2 text-premium-gray hover:text-premium-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-xl border border-premium-lightGray p-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-premium-black text-white' : 'text-premium-gray hover:bg-premium-beige'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('blockers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'blockers' ? 'bg-red-500 text-white' : 'text-premium-gray hover:bg-red-50'}`}
            >
              Blockers Only
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-12 pb-12">
        <AnimatePresence mode="popLayout">
          {Object.keys(groupedUpdates).length > 0 ? (
            Object.entries(groupedUpdates).map(([date, updates], groupIndex) => (
              <motion.div 
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 sticky top-0 bg-premium-beige/95 backdrop-blur-sm py-4 z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-premium-lightGray shadow-sm whitespace-nowrap">
                      {date}
                    </span>
                    <div className="h-[1px] w-12 bg-premium-lightGray hidden md:block"></div>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-premium-lightGray shadow-sm shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-bold text-premium-black">{updates.length} Updates</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-premium-lightGray shadow-sm shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <span className="text-[10px] font-bold text-premium-black">{updates.filter(u => u.blockers).length} Blockers</span>
                    </div>
                    <div className="flex -space-x-2 ml-2">
                      {Array.from(new Set(updates.map(u => u.userId?._id))).slice(0, 5).map((id, i) => {
                        const user = updates.find(u => u.userId?._id === id)?.userId;
                        return (
                          <div key={id} className="h-7 w-7 rounded-full bg-premium-beige border-2 border-white flex items-center justify-center text-[10px] font-bold text-premium-black" title={user?.name}>
                            {user?.name?.charAt(0)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {updates.map((update, i) => (
                    <motion.div 
                      key={update._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (i * 0.05) }}
                      className="premium-card hover:shadow-premium-hover transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                        <div className="flex items-center gap-5">
                          <div className="relative group/avatar">
                            <div className="h-14 w-14 bg-premium-beige border-2 border-premium-lightGray rounded-2xl flex items-center justify-center font-bold text-premium-black text-xl group-hover:border-premium-gold transition-all duration-300 shadow-sm">
                              {update.userId?.name?.charAt(0)}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-sm ${update.blockers ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-premium-black text-xl tracking-tight">
                                {update.userId?.name}
                              </h3>
                              <span className={`text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-widest font-bold border ${
                                update.userId?.role === 'manager' 
                                ? 'bg-premium-black text-white border-premium-black' 
                                : 'bg-premium-beige text-premium-black border-premium-lightGray'
                              }`}>
                                {update.userId?.role || 'Member'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-premium-gray font-bold">
                                <Clock size={12} className="text-premium-gold" />
                                {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="h-1 w-1 rounded-full bg-premium-lightGray"></div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${update.blockers ? 'text-red-500' : 'text-green-600'}`}>
                                {update.blockers ? 'Currently Blocked' : 'On Track'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-premium-beige/50 hover:bg-premium-beige rounded-xl text-[10px] font-bold text-premium-black transition-all border border-premium-lightGray/30 group/btn">
                            <MessageSquare size={14} className="text-premium-gray group-hover/btn:text-premium-black transition-colors" />
                            Comment
                          </button>
                          <button className="p-2 text-premium-gray hover:text-premium-black hover:bg-premium-beige rounded-xl transition-all border border-transparent hover:border-premium-lightGray/50">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-[9px] font-bold text-premium-gray uppercase tracking-[0.25em] flex items-center gap-2 ml-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-premium-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                            Yesterday's Progress
                          </h4>
                          <div className="bg-premium-beige/10 p-5 rounded-2xl border border-premium-lightGray/20 relative group-hover:bg-premium-beige/20 transition-all duration-300">
                            <p className="text-premium-black/80 leading-relaxed text-sm italic">
                              "{update.yesterday}"
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[9px] font-bold text-premium-gray uppercase tracking-[0.25em] flex items-center gap-2 ml-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                            Today's Focus
                          </h4>
                          <div className="bg-blue-50/10 p-5 rounded-2xl border border-blue-100/20 group-hover:bg-blue-50/20 transition-all duration-300">
                            <p className="text-premium-black leading-relaxed text-sm font-semibold">
                              {update.today}
                            </p>
                          </div>
                        </div>
                      </div>

                      {update.blockers && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-10 p-5 bg-red-50/30 rounded-2xl border border-red-100 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                          <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <AlertCircle size={12} />
                            Active Blockers
                          </h4>
                          <p className="text-red-700 font-semibold text-sm leading-relaxed">{update.blockers}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="premium-card text-center py-24 border-dashed border-2 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center justify-center p-6 bg-premium-beige rounded-3xl mb-6 shadow-inner">
                <History className="text-premium-gray" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-premium-black">No updates found</h3>
              <p className="text-premium-gray mt-2 max-w-xs mx-auto">Try adjusting your filters or searching for different keywords.</p>
              <button 
                onClick={() => { setSearchTerm(''); setFilter('all'); setSelectedMember('all'); setSelectedDate(''); }}
                className="mt-8 text-premium-gold font-bold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamFeed;
