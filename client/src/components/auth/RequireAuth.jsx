import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state if authentication is still being checked
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login with the return url
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default RequireAuth;