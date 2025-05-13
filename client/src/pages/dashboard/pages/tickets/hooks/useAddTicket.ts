import { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

interface NewTicket {
  title: string;
  description: string;
  priority: string;
}

interface AddTicketResult {
  addTicket: (newTicket: NewTicket) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAddTicket = (
  tickets: Ticket[],
  setTickets: (tickets: Ticket[]) => void
): AddTicketResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTicket = async (newTicket: NewTicket) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Oturum bulunamadı!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newTicket, status: "open" }), // Default status
      });

      if (response.ok) {
        const addedTicket: Ticket = await response.json();
        setTickets([...tickets, addedTicket]);
      } else {
        setError("Bilet eklenirken bir hata oluştu!");
      }
    } catch (error) {
      console.error("Bilet eklenirken hata:", error);
      setError("Bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return { addTicket, isLoading, error };
};