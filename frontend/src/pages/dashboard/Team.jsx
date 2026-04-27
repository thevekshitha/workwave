import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  User, 
  Copy, 
  Check, 
  MoreVertical, 
  Mail, 
  Calendar, 
  Search, 
  Plus, 
  Trash2, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Crown, 
  Settings, 
  UserCheck, 
  ExternalLink,
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/teams/members');
        setMembers(res?.data?.data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.teamId) {
      fetchMembers();
    }
  }, [user]);

  const copyTeamId = () => {
    if (user?.teamId) {
      navigator.clipboard.writeText(user.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // In a real app: await api.post('/teams/invite', { email: inviteEmail, role: inviteRole });
      alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (err) {
      console.error('Error sending invite:', err);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      // await api.patch(`/teams/members/${memberId}/role`, { role: newRole });
      setMembers(prev => Array.isArray(prev) ? prev.map(m => m._id === memberId ? { ...m, role: newRole } : m) : []);
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        // In a real app, this would be an API call
        // await api.delete(`/teams/members/${memberId}`);
        setMembers(prev => Array.isArray(prev) ? prev.filter(m => m._id !== memberId) : []);
      } catch (err) {
        console.error('Error removing member:', err);
      }
    }
  };

  const filteredMembers = Array.isArray(members) ? members.filter(m => 
    m?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-premium-black tracking-tight">Team Space</h1>
          <p className="text-premium-gray mt-1 font-medium">Coordinate and manage your high-performance team.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-premium-lightGray shadow-sm">
            <div className="px-3 py-1">
              <p className="text-[10px] font-bold text-premium-gray uppercase tracking-widest">Workspace ID</p>
              <p className="text-sm font-mono font-bold text-premium-black">
              {typeof user.teamId === 'object' ? (user.teamId?.teamId || user.teamId) : user.teamId}
            </p>
            </div>
            <button 
              onClick={copyTeamId}
              className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-premium-beige text-premium-black hover:bg-premium-lightGray'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          {user?.role === 'manager' && (
            <button 
              onClick={() => setShowInviteModal(true)}
              className="premium-button-primary flex items-center gap-2 shadow-premium hover:shadow-premium-hover"
            >
              <UserPlus size={18} /> Invite
            </button>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-premium-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-premium-lightGray"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-premium-black">Invite Member</h2>
                <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-premium-beige rounded-xl transition-all">
                  <X size={20} className="text-premium-gray" />
                </button>
              </div>
              
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="teammate@example.com"
                    className="premium-input"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['member', 'manager'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setInviteRole(r)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          inviteRole === r 
                            ? 'bg-premium-black text-white border-premium-black shadow-lg shadow-black/10' 
                            : 'bg-white text-premium-gray border-premium-lightGray hover:border-premium-gold/50 hover:text-premium-black'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="premium-button-primary w-full py-4 shadow-premium hover:shadow-premium-hover">
                  Send Invitation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'blue' },
          { label: 'Managers', value: members.filter(m => m.role === 'manager').length || 1, icon: Shield, color: 'purple' },
          { label: 'Active Today', value: Math.ceil(members.length * 0.8), icon: UserCheck, color: 'green' },
          { label: 'Open Slots', value: 4, icon: Plus, color: 'gold' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-2xl ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              'bg-premium-beige text-premium-gold'
            }`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-premium-gray uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-bold text-premium-black">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-premium-beige/30 p-4 rounded-2xl border border-premium-lightGray/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-gray" size={18} />
          <input 
            type="text" 
            placeholder="Find a teammate..."
            className="premium-input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-premium-lightGray rounded-xl text-sm font-bold text-premium-black hover:bg-premium-beige transition-all">
            <Filter size={16} /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-premium-lightGray rounded-xl text-sm font-bold text-premium-black hover:bg-premium-beige transition-all">
            <Settings size={16} /> Layout
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member, i) => (
            <motion.div 
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="premium-card group hover:border-premium-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              {member.role === 'manager' && (
                <div className="absolute top-0 right-0 p-1.5 bg-premium-gold text-white rounded-bl-xl shadow-sm">
                  <Crown size={12} />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="h-16 w-16 bg-premium-beige border-2 border-premium-lightGray rounded-2xl flex items-center justify-center font-bold text-premium-black text-2xl group-hover:border-premium-gold transition-colors">
                    {member.name?.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button className="p-2 text-premium-gray hover:text-premium-black hover:bg-premium-beige rounded-xl transition-all">
                    <Mail size={16} />
                  </button>
                  {user?.role === 'manager' && member._id !== user._id && (
                    <button 
                      onClick={() => handleRemoveMember(member._id)}
                      className="p-2 text-premium-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-premium-black text-lg group-hover:text-premium-gold transition-colors">
                    {member.name} {member._id === user._id && <span className="text-xs font-normal text-premium-gray">(You)</span>}
                  </h3>
                  <p className="text-xs text-premium-gray font-medium flex items-center gap-1.5 mt-0.5">
                    {member.email}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => user?.role === 'manager' && member._id !== user._id && handleUpdateRole(member._id, member.role === 'manager' ? 'member' : 'manager')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      member.role === 'manager' 
                      ? 'bg-premium-black text-white border-premium-black' 
                      : 'bg-premium-beige text-premium-black border-premium-lightGray hover:border-premium-gold/50'
                    } ${user?.role !== 'manager' || member._id === user._id ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {member.role === 'manager' ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                    {member.role || 'Member'}
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-green-50 text-green-600 border-green-100">
                    <UserCheck size={10} />
                    Active
                  </div>
                </div>

                <div className="pt-4 border-t border-premium-lightGray/50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full bg-premium-beige border border-white flex items-center justify-center text-[8px] font-bold text-premium-gray">
                        P{i+1}
                      </div>
                    ))}
                  </div>
                  <button className="text-[10px] font-bold text-premium-gray hover:text-premium-gold flex items-center gap-1 group/btn">
                    View Profile
                    <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Invite Member Card Placeholder */}
        {user?.role === 'manager' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card border-dashed border-2 border-premium-lightGray hover:border-premium-gold hover:bg-premium-beige/20 transition-all flex flex-col items-center justify-center text-center p-8 group min-h-[280px]"
          >
            <div className="h-14 w-14 bg-premium-beige rounded-2xl flex items-center justify-center text-premium-gray group-hover:bg-premium-gold group-hover:text-white transition-all duration-300 mb-4 shadow-sm">
              <UserPlus size={28} />
            </div>
            <h3 className="font-bold text-premium-black">Invite Member</h3>
            <p className="text-xs text-premium-gray mt-2 max-w-[200px]">Add a new collaborator to your team space</p>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TeamPage;