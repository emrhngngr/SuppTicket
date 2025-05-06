// import axios from "axios";
// import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import ThemeProvider from "./context/ThemeContext";
import LoginPage from "./pages/auth/LoginPage";
import ContactPage from "./pages/landing/ContactPage/index";
import HomePage from "./pages/landing/HomePage/index";
import PricingPage from "./pages/landing/PricingPage/index";
import NotFound from "./pages/NotFound";
import AuthProvider from "./providers/AuthProvider";
import LandingLayout from "./components/layouts/landing/LandingLayout";

import { adminRoutes } from "./routes/adminRoutes";
import { userRoutes } from "./routes/userRoutes";
import DashboardWrapper from "./components/layouts/dashboard/DashboardWrapper";
import MainWrapper from "./components/layouts/dashboard/MainWrapper";

function App() {
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/home")
  //     .then((res) => {
  //       console.log(res.data.message);
  //     })
  //     .catch((err) => {
  //       console.error("API hatası:", err);
  //     });
  // }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<LandingLayout><PricingPage /></LandingLayout>} />
            <Route path="/contact" element={<LandingLayout><ContactPage /></LandingLayout>} />

            {/* User Routes */}
            {adminRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<DashboardWrapper>{element}</DashboardWrapper>}
              />
            ))}

            {userRoutes.map(({path, element}) => (
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
