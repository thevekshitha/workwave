import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Send, AlertCircle, CheckCircle2, History, Target, AlertTriangle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const StandUpForm = () => {
  const [formData, setFormData] = useState({
    yesterday: '',
    today: '',
    blockers: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/updates/create', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit update');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card text-center py-16 px-12 max-w-md w-full shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="bg-green-50 p-6 rounded-3xl border border-green-100 shadow-inner"
            >
              <CheckCircle2 size={64} className="text-green-500" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-premium-black tracking-tight">Stand-up Logged!</h2>
          <p className="text-premium-gray mt-3 font-medium">Your progress has been shared with the team.</p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-premium-gold font-bold text-sm">
              <div className="h-4 w-4 border-2 border-premium-gold/30 border-t-premium-gold rounded-full animate-spin"></div>
              Moving to feed...
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-premium-gray hover:text-premium-black font-bold text-xs uppercase tracking-widest mb-4 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-premium-black tracking-tight">Daily Stand-up</h1>
          <p className="text-premium-gray mt-2 font-medium">Coordinate with your team and keep everyone in sync.</p>
        </div>
        <div className="hidden md:block">
          <div className="h-16 w-16 bg-premium-beige rounded-2xl flex items-center justify-center text-premium-gold shadow-sm border border-premium-lightGray">
            <Target size={32} />
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm border border-red-100 flex items-center gap-4 shadow-sm"
          >
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-8 space-y-10 shadow-premium"
        >
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] flex items-center gap-2">
              <History size={14} className="text-premium-gold" />
              What did you do yesterday?
            </label>
            <textarea
              name="yesterday"
              required
              rows="4"
              className="premium-input resize-none text-base p-5"
              placeholder="e.g. Finalized the authentication middleware and started working on the team feed UI components..."
              value={formData.yesterday}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] flex items-center gap-2">
              <Target size={14} className="text-blue-500" />
              What are you doing today?
            </label>
            <textarea
              name="today"
              required
              rows="4"
              className="premium-input resize-none text-base p-5"
              placeholder="e.g. Integrating the Stand-up form with the backend and adding framer-motion animations..."
              value={formData.today}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em] flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              Any blockers? <span className="text-[9px] font-normal lowercase tracking-normal">(Leave empty if none)</span>
            </label>
            <textarea
              name="blockers"
              rows="3"
              className="premium-input resize-none text-base p-5 border-red-50 focus:border-red-200 focus:ring-red-100/50"
              placeholder="e.g. Waiting for API documentation on the new analytics endpoints..."
              value={formData.blockers}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full premium-button-primary flex items-center justify-center gap-3 py-5 shadow-premium hover:shadow-premium-hover transition-all text-base group"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging Update...
                </>
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Submit Stand-up
                </>
              )}
            </button>
            <p className="text-center text-premium-gray text-[10px] mt-6 font-medium uppercase tracking-widest">
              Your team will see this update in the feed
            </p>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default StandUpForm;
