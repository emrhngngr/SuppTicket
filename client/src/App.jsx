// App.js

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";
import DashboardWrapper from "./components/layouts/dashboard/DashboardWrapper";
import MainWrapper from "./components/layouts/dashboard/MainWrapper";
import LandingLayout from "./components/layouts/landing/LandingLayout";
import ThemeProvider from "./context/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/auth/LoginPage";
import ContactPage from "./pages/landing/ContactPage/index";
import HomePage from "./pages/landing/HomePage/index";
import PricingPage from "./pages/landing/PricingPage/index";
import AccountPage from "./pages/main/topics/contents/AccountPage";
import BillingPage from "./pages/main/topics/contents/BillingPage";
import DevicePage from "./pages/main/topics/contents/DevicePage";
import SoftwarePage from "./pages/main/topics/contents/SoftwarePage";
import NotFound from "./pages/NotFound";
import { adminRoutes } from "./routes/adminRoutes";
import { userRoutes } from "./routes/userRoutes";

const topicRoutes = [
  { path: "/topics/device", element: <DevicePage /> },
  { path: "/topics/billing", element: <BillingPage /> },
  { path: "/topics/account", element: <AccountPage /> },
  { path: "/topics/software", element: <SoftwarePage /> },
];

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    console.log("ProtectedRoute: isLoading...");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {" "}
        <ClipLoader
          color="black"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    ); // or a Spinner component
  }

  // If loading is finished but there's no role, redirect to login
  if (!role) {
    console.log("ProtectedRoute: No role, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // If role exists but is not among the allowed roles, redirect to not-found
  if (!allowedRoles.includes(role)) {
    console.log(
      `ProtectedRoute: Role "${role}" not allowed. Allowed: ${allowedRoles.join(
        ", "
      )}. Redirecting to /not-found`
    );
    return <Navigate to="/not-found" replace />;
  }

  // Authorization check passed, render the requested component
  console.log(`ProtectedRoute: Role "${role}" allowed. Rendering element.`);
  return element;
};

// RedirectIfLoggedIn component (Optional but recommended)
// Redirects the user to their dashboard if they try to access the login page while already logged in.
const RedirectIfLoggedIn = ({ children }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {" "}
        <ClipLoader
          color="black"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    ); // Handle loading state
  }

  if (role) {
    // Redirect to the appropriate dashboard based on the role
    if (role === "admin" || role === "super_admin") {
      // Enter the default admin route here, e.g., '/admin' or '/admin/dashboard'
      return <Navigate to={adminRoutes[0]?.path || "/"} replace />;
    }
    if (role === "user") {
      // Enter the default user route here, e.g., '/user' or '/user/dashboard'
      return <Navigate to={userRoutes[0]?.path || "/"} replace />;
    }
    // Can be redirected to the home page if the role is undefined
    return <Navigate to="/" replace />;
  }

  // If not logged in, show children (LoginPage)
  return children;
};

function App() {
  // Let's get the isLoading state in the App component as well
  const { isLoading } = useAuth();

  // If the authentication status is loading, show the entire application in a loading state
  if (isLoading) {
    // It's good practice to show a loading indicator that covers the entire application here
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader
          color="black"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  // Render Router and Routes when isLoading is false
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <LandingLayout>
                <HomePage />
              </LandingLayout>
            }
          />
          {/* Wrap the login page with RedirectIfLoggedIn */}
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <LoginPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/pricing"
            element={
              <LandingLayout>
                <PricingPage />
              </LandingLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <LandingLayout>
                <ContactPage />
              </LandingLayout>
            }
          />

          {/* Topic Routes - Decide if these need protection */}
          {/* If they need protection, wrap them with ProtectedRoute */}
          {topicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                // Example: All roles can access
                <ProtectedRoute
                  element={<MainWrapper>{element}</MainWrapper>}
                  allowedRoles={["super_admin", "admin", "user"]} // Adjust according to your requirements
                />
                // Or if unprotected:
                // <MainWrapper>{element}</MainWrapper>
              }
            />
          ))}

          {/* Admin Routes - Always defined, access controlled by ProtectedRoute */}
          {adminRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  element={<DashboardWrapper>{element}</DashboardWrapper>}
                  allowedRoles={["super_admin", "admin"]}
                />
              }
            />
          ))}

          {/* User Routes - Always defined, access controlled by ProtectedRoute */}
          {userRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  element={<MainWrapper>{element}</MainWrapper>}
                  allowedRoles={["user"]} // If you want admins to access as well: ["super_admin", "admin", "user"]
                />
              }
            />
          ))}

          {/* Not Found - For all other paths */}
          {/* Decide if NotFound should be inside or outside LandingLayout */}
          <Route path="*" element={<NotFound />} />
          {/* Or: <Route path="*" element={<LandingLayout><NotFound /></LandingLayout>} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
