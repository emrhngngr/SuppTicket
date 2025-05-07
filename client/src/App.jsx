import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
// import CreateTicketPage from "./pages/main/tickets/CreateTicketPage";
// import NetworkPage from "./pages/topics/contents/NetworkPage";
// import SecurityPage from "./pages/topics/contents/SecurityPage";
// import AccessoriesPage from "./pages/topics/contents/AccessoriesPage";
// import OtherPage from "./pages/topics/OtherPage";

const topicRoutes = [
  { path: "/topics/device", element: <DevicePage /> },
  { path: "/topics/billing", element: <BillingPage /> },
  { path: "/topics/account", element: <AccountPage /> },
  { path: "/topics/software", element: <SoftwarePage /> },
  // { path: "/topics/network", element: <NetworkPage /> },
  // { path: "/topics/security", element: <SecurityPage /> },
  // { path: "/topics/accessories", element: <AccessoriesPage /> },
  // { path: "/topics/other", element: <OtherPage /> },
];

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
            {/* <Route path="/create-ticket" element={<MainWrapper><CreateTicketPage/></MainWrapper>} /> */}
            {/* User Routes */}
            {adminRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<DashboardWrapper>{element}</DashboardWrapper>}
              />
            ))}
            {userRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<MainWrapper>{element}</MainWrapper>}
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