import axios from "axios";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layouts/main/MainLayout";

import DashboardLayout from "./components/layouts/dashboard/DashboardLayout";
import ThemeProvider from "./context/ThemeContext";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/dashboard/index";
import ContactPage from "./pages/landing/ContactPage/index";
import HomePage from "./pages/landing/HomePage/index";
import PricingPage from "./pages/landing/PricingPage/index";
import NotFound from "./pages/NotFound";
import AuthProvider from "./providers/AuthProvider";
import Topics from "./pages/dashboard/pages/topics/index";
import Tickets from "./pages/dashboard/pages/tickets/index";
import Users from "./pages/dashboard/pages/users/index"

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
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/pricing"
            element={
              <MainLayout>
                <PricingPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/topics"
            element={
              <DashboardLayout>
                <Topics />
              </DashboardLayout>
            }
          />
          <Route
            path="/tickets"
            element={
              <DashboardLayout>
                <Tickets />
              </DashboardLayout>
            }
          />
          <Route
            path="/users"
            element={
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
