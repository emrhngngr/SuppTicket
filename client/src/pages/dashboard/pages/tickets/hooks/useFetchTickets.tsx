import { useEffect, useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

interface FetchTicketsResult {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

export const useFetchTickets = (): FetchTicketsResult => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to continue.");
          return;
        }

        // Fetch user data
        const userResponse = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("User data could not be fetched");
        }

        const userData = await userResponse.json();
        console.log("userData ==> ", userData);

        // Fetch tickets
        const ticketsResponse = await fetch("http://localhost:5000/api/tickets", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!ticketsResponse.ok) {
          throw new Error("Veriler alınamadı");
        }

        const data = await ticketsResponse.json();
        if (isMounted) {
          setTickets(data.rows);
        }
      } catch (error) {
        console.error("Veri alınırken hata:", error);
        if (isMounted) {
          setError("Biletler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı! Lütfen giriş yapın.");
      return;
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { tickets, isLoading, error };
};