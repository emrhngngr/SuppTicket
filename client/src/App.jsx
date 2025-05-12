import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import ThemeProvider from "./context/ThemeContext";
import LoginPage from "./pages/auth/LoginPage";
import ContactPage from "./pages/landing/ContactPage/index";
import HomePage from "./pages/landing/HomePage/index";
import PricingPage from "./pages/landing/PricingPage/index";
import NotFound from "./pages/NotFound";
import LandingLayout from "./components/layouts/landing/LandingLayout";
import { adminRoutes } from "./routes/adminRoutes";
import { userRoutes } from "./routes/userRoutes";
import DashboardWrapper from "./components/layouts/dashboard/DashboardWrapper";
import MainWrapper from "./components/layouts/dashboard/MainWrapper";
import DevicePage from "./pages/main/topics/contents/DevicePage";
import BillingPage from "./pages/main/topics/contents/BillingPage";
import AccountPage from "./pages/main/topics/contents/AccountPage";
import SoftwarePage from "./pages/main/topics/contents/SoftwarePage";
import { useAuth } from "./hooks/useAuth";

const topicRoutes = [
  { path: "/topics/device", element: <DevicePage /> },
  { path: "/topics/billing", element: <BillingPage /> },
  { path: "/topics/account", element: <AccountPage /> },
  { path: "/topics/software", element: <SoftwarePage /> },
];

// ProtectedRoute component to handle role-based access
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { role, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while user data is fetched
  }
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-found" replace />;
  }
  
  return element;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pricing" element={<LandingLayout><PricingPage /></LandingLayout>} />
          <Route path="/contact" element={<LandingLayout><ContactPage /></LandingLayout>} />
          {/* Topic Routes */}
          {topicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<MainWrapper>{element}</MainWrapper>}
            />
          ))}
          {/* Admin Routes (super_admin and admin only) */}
          {adminRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  element={<DashboardWrapper>{element}</DashboardWrapper>}
                  allowedRoles={['super_admin', 'admin']}
                />
              }
            />
          ))}
          {/* User Routes (user role only) */}
          {userRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  element={<MainWrapper>{element}</MainWrapper>}
                  allowedRoles={['user']}
                />
              }
            />
          ))}
          {/* 404 */}
          <Route path="*" element={<LandingLayout><NotFound /></LandingLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;