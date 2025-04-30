// src/providers/AuthProvider.jsx
import { useEffect } from 'react';
import axios from 'axios';

const AuthProvider = ({ children }) => {

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error('Kullanıcı verisi alınamadı:', err);
      }
    };

    fetchMe();
  }, []);

  return children;
};

export default AuthProvider;
