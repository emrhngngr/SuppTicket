import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useEffect } from 'react'
import axios from 'axios'
import './App.css'

import MainLayout from './components/layouts/MainLayout'

import HomePage from './pages/landing/HomePage/index'
import LoginPage from './pages/auth/LoginPage'
import PricingPage from './pages/landing/PricingPage/index'
import ContactPage from './pages/landing/ContactPage/index'
import NotFound from './pages/NotFound'
import Dashboard from './pages/dashboard/index'

function App() {

  useEffect(() => {
    axios.get('http://localhost:3000/api/home')
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error('API hatası:', err);
      });
  }, []);

  return (
<Router>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App
