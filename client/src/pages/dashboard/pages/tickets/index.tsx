import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddTicketModal } from "./components/AddTicketModal";
import { TicketsTable } from "./components/TicketsTable";
import { useFetchTickets } from "./hooks/useFetchTickets";
import { useAddTicket } from "./hooks/useAddTicket";

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

const Tickets = () => {
  const { tickets, isLoading: isFetching, error: fetchError } = useFetchTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<NewTicket>({
    title: "",
    description: "",
    priority: "low",
  });
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);

  const { addTicket, isLoading: isAdding, error: addError } = useAddTicket(localTickets, setLocalTickets);

  // Sync localTickets with fetched tickets
  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  const filteredTickets = Array.isArray(localTickets)
    ? localTickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddTicket = async () => {
    await addTicket(newTicket);
    setNewTicket({ title: "", description: "", priority: "low" });
    setIsModalOpen(false);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
  ];

  const error = fetchError || addError;

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <span>New Ticket</span>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isFetching ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <TicketsTable tickets={filteredTickets} columns={columns} />
      )}

      <AddTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        onAddTicket={handleAddTicket}
        isLoading={isAdding}
      />
    </div>
  );
};

export default Tickets;