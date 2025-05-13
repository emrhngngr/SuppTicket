import { useState } from "react";

interface Topic {
  id: number;
  title: string;
  description: string;
  createDate: string;
  roles?: string[];
  active?: boolean | string;
}

interface NewTopic {
  title: string;
  description: string;
}

interface AddTopicResult {
  addTopic: (newTopic: NewTopic) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAddTopic = (
  topics: Topic[],
  setTopics: (topics: Topic[]) => void
): AddTopicResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTopic = async (newTopic: NewTopic) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Oturum bulunamadı!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/topics", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTopic),
      });

      if (response.ok) {
        const addedTopic: Topic = await response.json();
        setTopics([...topics, addedTopic]);
      } else {
        setError("Konu eklenirken bir hata oluştu!");
      }
    } catch (error) {
      console.error("Konu eklenirken hata:", error);
      setError("Bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return { addTopic, isLoading, error };
};