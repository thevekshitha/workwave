import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, UserPlus, ArrowRight, X } from 'lucide-react';

const TeamManagement = () => {
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading: authLoading, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user?.teamId) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/teams', { name: teamName.trim() });
      const team = res.data?.data?.team;
      if (team?.teamId) {
        const updatedUser = { ...user, teamId: team.teamId, role: 'manager' };
        setUser(updatedUser);
        navigate('/dashboard');
      } else {
        setError('Team created but ID missing. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/teams/join/${teamId.trim()}`);
      const team = res.data?.data?.team;
      if (team?.teamId) {
        const updatedUser = { ...user, teamId: team.teamId };
        setUser(updatedUser);
        navigate('/dashboard');
      } else {
        setError('Joined team but team ID missing. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-premium-black rounded-3xl mb-6 shadow-xl shadow-black/10">
          <Users className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-premium-black tracking-tight">Team Setup</h1>
        <p className="text-premium-gray mt-3 text-lg">Create a new workspace or join an existing one to get started.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 mb-8 max-w-md mx-auto flex items-center gap-3">
          <div className="bg-red-100 p-1.5 rounded-full">
            <X size={14} />
          </div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Only show Create Team if user doesn't have a team yet */}
        {!user?.teamId && (
          <div className="premium-card flex flex-col h-full hover:border-premium-gold/30 transition-all duration-300">
            <div className="mb-6">
              <div className="h-12 w-12 bg-premium-beige rounded-2xl flex items-center justify-center mb-4">
                <Plus className="text-premium-black" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-premium-black">Create a Team</h2>
              <p className="text-premium-gray text-sm mt-1">Start a new space for your remote team (you will be the manager).</p>
            </div>
            
            <form onSubmit={handleCreateTeam} className="space-y-4 mt-auto">
              <div>
                <label className="block text-xs font-bold text-premium-gray uppercase tracking-widest mb-1.5 ml-1">Team Name</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="e.g. Engineering Alpha"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !teamName}
                className="w-full premium-button-primary flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : 'Create Team'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Join Team is always shown if user doesn't have a team */}
        {!user?.teamId && (
          <div className="premium-card flex flex-col h-full hover:border-premium-gold/30 transition-all duration-300">
            <div className="mb-6">
              <div className="h-12 w-12 bg-premium-beige rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="text-premium-black" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-premium-black">Join a Team</h2>
              <p className="text-premium-gray text-sm mt-1">Enter a team ID to join your colleagues.</p>
            </div>
            
            <form onSubmit={handleJoinTeam} className="space-y-4 mt-auto">
              <div>
                <label className="block text-xs font-bold text-premium-gray uppercase tracking-widest mb-1.5 ml-1">Team ID</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Paste team ID here"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !teamId}
                className="w-full premium-button-secondary flex items-center justify-center gap-2"
              >
                {loading ? 'Joining...' : 'Join Team'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* If user already has a team, show a message */}
        {user?.teamId && (
          <div className="md:col-span-2 premium-card text-center py-16">
            <div className="inline-flex items-center justify-center p-6 bg-premium-beige rounded-3xl mb-6">
              <Users className="text-premium-black" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-premium-black mb-2">You're already in a team!</h2>
            <p className="text-premium-gray mb-8">Your Team ID: <span className="font-mono font-bold text-premium-black">{user.teamId}</span></p>
            <button
              onClick={() => navigate('/dashboard')}
              className="premium-button-primary px-8"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
