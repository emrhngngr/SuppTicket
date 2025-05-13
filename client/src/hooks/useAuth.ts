import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "super_admin" | "admin" | "user";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    refresh: loadUser, // Optional: Call this after login to force reload
  };
};