import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <PulseLoader
        color="#4F46E5"
        size={150}
        />{" "}
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
