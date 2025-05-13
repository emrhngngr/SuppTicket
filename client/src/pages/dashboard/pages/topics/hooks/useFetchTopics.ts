import { useEffect, useState } from "react";

interface Topic {
  id: number;
  title: string;
  description: string;
  createDate: string;
  roles?: string[];
  active?: boolean | string;
}

interface FetchTopicsResult {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
}

export const useFetchTopics = (): FetchTopicsResult => {
  const [topics, setTopics] = useState<Topic[]>([]);
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

        // Fetch topics
        const topicsResponse = await fetch("http://localhost:5000/api/topics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!topicsResponse.ok) {
          throw new Error("Veriler alınamadı");
        }

        const data = await topicsResponse.json();
        if (isMounted) {
          setTopics(data.rows);
        }
      } catch (error) {
        console.error("Veri alınırken hata:", error);
        if (isMounted) {
          setError("Konular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
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
  }, []); // Empty deps since this runs once on mount

  return { topics, isLoading, error };
};