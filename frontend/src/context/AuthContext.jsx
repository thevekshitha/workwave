import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalizeTeamId = (teamId) => {
      if (typeof teamId === 'object' && teamId !== null) {
        return teamId?.teamId ?? String(teamId);
      }
      return teamId;
    };

    const normalizeUser = (userData) => {
      console.log('normalizeUser - original userData:', userData);
      console.log('normalizeUser - original teamId:', userData?.teamId, 'typeof:', typeof userData?.teamId);
      
      let teamId = normalizeTeamId(userData?.teamId);
      
      if (
        teamId === null ||
        teamId === undefined ||
        teamId === '' ||
        teamId === 'null' ||
        teamId === 'undefined' ||
        (typeof teamId === 'string' && teamId.trim() === '')
      ) {
        teamId = null;
      }
      
      const normalized = {
        ...userData,
        teamId: teamId,
      };
      
      console.log('normalizeUser - final normalized teamId:', normalized.teamId, 'typeof:', typeof normalized.teamId);
      return normalized;
    };

    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/profile');
          console.log('AuthContext - profile response:', res.data.data);
          const normalized = normalizeUser(res.data.data);
          console.log('AuthContext - normalized user:', normalized);
          setUser(normalized);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const normalizeTeamId = (teamId) => {
    if (typeof teamId === 'object' && teamId !== null) {
      return teamId?.teamId ?? String(teamId);
    }
    return teamId;
  };

  const normalizeUser = (userData) => {
    console.log('normalizeUser - original userData:', userData);
    console.log('normalizeUser - original teamId:', userData?.teamId, 'typeof:', typeof userData?.teamId);
    
    let teamId = normalizeTeamId(userData?.teamId);
    
    if (
      teamId === null ||
      teamId === undefined ||
      teamId === '' ||
      teamId === 'null' ||
      teamId === 'undefined' ||
      (typeof teamId === 'string' && teamId.trim() === '')
    ) {
      teamId = null;
    }
    
    const normalized = {
      ...userData,
      teamId: teamId,
    };
    
    console.log('normalizeUser - final normalized teamId:', normalized.teamId, 'typeof:', typeof normalized.teamId);
    return normalized;
  };

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
