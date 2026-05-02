import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowRight } from 'lucide-react';

const JoinTeam = ({ onSuccess }) => {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post(`/teams/join/${teamId.trim()}`);
      const team = res.data?.data?.team;

      if (team?.teamId) {
        // Update user context with new teamId
        setUser({ ...user, teamId: team.teamId });
        setTeamId('');
        if (onSuccess) onSuccess();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-premium-lightGray">
      <h2 className="text-2xl font-bold text-premium-black mb-2">Join Team</h2>
      <p className="text-premium-gray text-sm mb-6">Enter the team ID shared by your manager</p>

      <form onSubmit={handleJoinTeam} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Team ID</label>
          <input
            type="text"
            required
            placeholder="Enter team ID"
            className="premium-input mt-2"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !teamId.trim()}
          className="premium-button-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Joining...' : 'Join Team'} {!loading && <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
};

export default JoinTeam;
