import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/ui/PasswordInput';
import { Layout } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.endsWith('@gmail.com')) {
      setError('Only @gmail.com addresses are allowed');
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-beige flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-premium-black p-3 rounded-2xl">
            <Layout className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-premium-black">
          Create account
        </h2>
        <p className="mt-2 text-center text-sm text-premium-gray">
          Join your team's stand-up tool
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="premium-card mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-premium-gray mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="premium-input"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-gray mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                className="premium-input"
                placeholder="alex@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-gray mb-1.5">
                Password
              </label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-gray mb-1.5">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="premium-input appearance-none bg-white"
              >
                <option value="member">Team Member</option>
                <option value="manager">Team Manager</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full premium-button-primary"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-premium-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-premium-gold font-semibold hover:text-premium-gold/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
