import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalizeUser = (userData) => ({
      ...userData,
      teamId: typeof userData?.teamId === 'object' ? (userData.teamId?.teamId || String(userData.teamId)) : userData?.teamId ?? null,
    });

    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/profile');
          setUser(normalizeUser(res.data.data));
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const normalizeUser = (userData) => ({
    ...userData,
    teamId: typeof userData?.teamId === 'object' ? (userData.teamId?.teamId || String(userData.teamId)) : userData?.teamId ?? null,
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    localStorage.setItem('token', res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
