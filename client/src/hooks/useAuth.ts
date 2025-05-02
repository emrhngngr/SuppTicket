import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "super_admin" | "admin" | "user";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false); // her durumda loading biter
  }, []);

  return { user, isAuthenticated: !!user, isLoading };
};
