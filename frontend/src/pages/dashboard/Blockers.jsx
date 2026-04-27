import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  User, 
  Clock, 
  Flag, 
  MoreVertical, 
  CheckCircle, 
  PauseCircle, 
  PlayCircle,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlockersPage = () => {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'resolved'

  useEffect(() => {
    const fetchBlockers = async () => {
      try {
        const res = await api.get('/updates/blockers');
        const data = res.data?.data;
        if (Array.isArray(data)) {
          const enrichedData = data.map(item => ({
            ...item,
            priority: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
            status: 'Open',
            notes: ''
          }));
          setBlockers(enrichedData);
        } else {
          setBlockers([]);
        }
      } catch (err) {
        console.error('Error fetching blockers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlockers();
  }, []);

  const handleResolve = (id) => {
    setBlockers(prev => prev.map(b => 
      b._id === id ? { ...b, status: 'Resolved' } : b
    ));
  };

  const filteredBlockers = blockers.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'open') return b.status === 'Open';
    if (filter === 'resolved') return b.status === 'Resolved';
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-premium-black tracking-tight flex items-center gap-3">
            <AlertTriangle className="text-red-500" />
            Priority Blockers
          </h1>
          <p className="text-premium-gray mt-1 font-medium">Critical issues requiring manager attention and resolution.</p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-premium-lightGray p-1 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-premium-black text-white' : 'text-premium-gray hover:bg-premium-beige'}`}
          >
            All Items
          </button>
          <button 
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'open' ? 'bg-red-500 text-white' : 'text-premium-gray hover:bg-red-50'}`}
          >
            Open
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'resolved' ? 'bg-green-600 text-white' : 'text-premium-gray hover:bg-green-50'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBlockers.length > 0 ? (
            filteredBlockers.map((blocker, i) => (
              <motion.div 
                key={blocker._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`premium-card overflow-hidden transition-all duration-300 border-l-4 ${
                  blocker.status === 'Resolved' ? 'border-l-green-500 opacity-75' : 
                  (blocker.priority === 'High' ? 'border-l-red-500 shadow-[0_4px_20px_-5px_rgba(239,68,68,0.1)]' : 
                   blocker.priority === 'Medium' ? 'border-l-orange-500' : 'border-l-blue-500')
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Side: Member & Info */}
                  <div className="lg:w-1/4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-premium-beige border border-premium-lightGray rounded-2xl flex items-center justify-center font-bold text-premium-black text-lg group-hover:border-premium-gold transition-colors">
                        {blocker.userId?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-premium-black leading-tight">{blocker.userId?.name}</h3>
                        <p className="text-[10px] text-premium-gray uppercase font-bold tracking-widest mt-0.5">
                          {blocker.userId?.role || 'Team Member'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-premium-gray">
                        <Clock size={14} className="text-premium-gold" />
                        {new Date(blocker.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-premium-gray">
                        <Flag size={14} className={
                          blocker.priority === 'High' ? 'text-red-500' : 
                          blocker.priority === 'Medium' ? 'text-orange-500' : 'text-blue-500'
                        } />
                        Priority: <span className={`font-bold ${
                          blocker.priority === 'High' ? 'text-red-600' : 
                          blocker.priority === 'Medium' ? 'text-orange-600' : 'text-blue-600'
                        }`}>{blocker.priority}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        blocker.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-100' : 
                        blocker.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {blocker.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Description & Notes */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-premium-beige/30 p-5 rounded-2xl border border-premium-lightGray/50 relative group">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={14} className="text-premium-gray" />
                      </div>
                      <h4 className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] mb-3">Blocker Description</h4>
                      <p className="text-premium-black font-medium leading-relaxed italic">
                        "{blocker.blockers}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] flex items-center gap-2">
                          <MessageCircle size={12} />
                          Manager Notes
                        </h4>
                        <button className="text-[10px] font-bold text-premium-gold hover:underline">Edit Notes</button>
                      </div>
                      <div className="bg-white border border-dashed border-premium-lightGray p-4 rounded-xl min-h-[80px] flex items-center justify-center hover:border-premium-gold transition-colors">
                        <p className="text-xs text-premium-gray italic">No notes added yet. Click edit to add manager feedback.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="lg:w-1/5 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em]">Actions</h4>
                      {blocker.status !== 'Resolved' ? (
                        <>
                          <button 
                            onClick={() => handleResolve(blocker._id)}
                            className="w-full flex items-center justify-center gap-2 bg-premium-black text-white py-2.5 rounded-xl text-xs font-bold hover:bg-premium-gray transition-all active:scale-95 shadow-lg shadow-black/10"
                          >
                            <CheckCircle size={14} />
                            Resolve Now
                          </button>
                          <button className="w-full flex items-center justify-center gap-2 bg-white text-premium-black border border-premium-lightGray py-2.5 rounded-xl text-xs font-bold hover:bg-premium-beige transition-all active:scale-95">
                            <PauseCircle size={14} />
                            In Progress
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 border border-green-100 py-2.5 rounded-xl text-xs font-bold cursor-default">
                          <CheckCircle2 size={14} />
                          Resolved
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-premium-beige/50 p-4 rounded-xl border border-premium-lightGray/30">
                      <p className="text-[10px] text-premium-gray font-bold uppercase tracking-widest mb-2">Team Sync</p>
                      <button className="w-full text-xs font-bold text-premium-black bg-white py-2 rounded-lg border border-premium-lightGray hover:border-premium-gold transition-all flex items-center justify-center gap-2 group">
                        Notify Member
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="premium-card text-center py-24 bg-green-50/20 border-dashed border-green-200 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center justify-center p-6 bg-green-100 rounded-3xl mb-6 shadow-inner">
                <CheckCircle2 className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-premium-black tracking-tight">Clear Runway!</h3>
              <p className="text-premium-gray mt-2 max-w-xs mx-auto font-medium">No active blockers found. Your team is moving efficiently toward their goals.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredBlockers.length > 0 && filter === 'open' && (
        <div className="premium-card bg-premium-black text-white border-none p-10 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <AlertTriangle size={240} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-3 tracking-tight">Need a Team Huddle?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium">If these blockers persist, consider a quick 5-minute sync to unblock the team manually. Real-time collaboration can often solve what asynchronous updates can't.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-premium-black px-8 py-3 rounded-xl font-bold hover:bg-premium-beige transition-all active:scale-95">
                Schedule Zoom Call
              </button>
              <button className="bg-transparent text-white border border-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95">
                Message Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockersPage;
