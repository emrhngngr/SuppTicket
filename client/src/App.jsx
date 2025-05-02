import axios from "axios";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layouts/main/MainLayout";
import ThemeProvider from "./context/ThemeContext";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/dashboard/index";
import ContactPage from "./pages/landing/ContactPage/index";
import HomePage from "./pages/landing/HomePage/index";
import PricingPage from "./pages/landing/PricingPage/index";
import NotFound from "./pages/NotFound";
import AuthProvider from "./providers/AuthProvider";

import Companies from "./pages/dashboard/pages/companies/index";
import Tickets from "./pages/dashboard/pages/tickets/index";
import Topics from "./pages/dashboard/pages/topics/index";
import Users from "./pages/dashboard/pages/users/index";

import { userRoutes } from "./routes/userRoutes";
import DashboardWrapper from "./components/layouts/dashboard/DashboardWrapper";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/home")
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error("API hatası:", err);
      });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

            {/* User Routes */}
            {userRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<DashboardWrapper>{element}</DashboardWrapper>}
              />
            ))}

            {/* 404 */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
