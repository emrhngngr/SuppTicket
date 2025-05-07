// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

/**
 * A component that protects routes based on user roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {Array<string>} props.allowedRoles - The roles that are allowed to access this route
 * @returns {React.ReactNode}
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();

  // Get user data from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role || "guest";

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but not authorized for this route
  if (!allowedRoles.includes(userRole)) {
    // Redirect to a different page based on their role
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "user") {
      return <Navigate to="/user/dashboard" replace />;
    } else {
      // Fallback for any other role
      return <Navigate to="/" replace />;
    }
  }

  // If authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;