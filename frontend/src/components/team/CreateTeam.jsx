import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Copy, Check, ArrowRight } from 'lucide-react';

const CreateTeam = ({ onSuccess }) => {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTeamId, setCreatedTeamId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/teams', { name: teamName });
      const team = res.data?.data?.team;

      if (team?.teamId) {
        setCreatedTeamId(team.teamId);
        setTeamName('');
        // Update user context with new teamId
        setUser({ ...user, teamId: team.teamId });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const copyTeamId = () => {
    navigator.clipboard.writeText(createdTeamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdTeamId) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-premium-lightGray">
        <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6">
          <Check size={32} />
        </div>
        <h2 className="text-2xl font-bold text-premium-black mb-2 text-center">Team Created!</h2>
        <p className="text-premium-gray text-center mb-6">Share this ID with your team members</p>
        
        <div className="bg-premium-beige p-4 rounded-xl mb-6 flex items-center justify-between">
          <code className="font-mono font-bold text-premium-black">{createdTeamId}</code>
          <button
            onClick={copyTeamId}
            className={`p-2 rounded-lg transition-all ${
              copied
                ? 'bg-green-100 text-green-600'
                : 'bg-white text-premium-black hover:bg-premium-lightGray'
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="premium-button-primary w-full flex items-center justify-center gap-2"
        >
          Go to Dashboard <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-premium-lightGray">
      <h2 className="text-2xl font-bold text-premium-black mb-2">Create Team</h2>
      <p className="text-premium-gray text-sm mb-6">Create a new team workspace</p>

      <form onSubmit={handleCreateTeam} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Team Name</label>
          <input
            type="text"
            required
            placeholder="Enter team name"
            className="premium-input mt-2"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
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
          disabled={loading || !teamName.trim()}
          className="premium-button-primary w-full"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
