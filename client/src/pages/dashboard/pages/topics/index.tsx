import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddTopicModal } from "./components/AddTopicModal";
import { TopicsTable } from "./components/TopicsTable";
import { useFetchTopics } from "./hooks/useFetchTopics";
import { useAddTopic } from "./hooks/useAddTopic";

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

const Topics = () => {
  const { topics, isLoading: isFetching, error: fetchError } = useFetchTopics();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState<NewTopic>({ title: "", description: "" });
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);

  const { addTopic, isLoading: isAdding, error: addError } = useAddTopic(localTopics, setLocalTopics);

  // Sync localTopics with fetched topics
  useEffect(() => {
    setLocalTopics(topics);
  }, [topics]);

  const filteredTopics = Array.isArray(localTopics)
    ? localTopics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddTopic = async () => {
    await addTopic(newTopic);
    setNewTopic({ title: "", description: "" });
    setIsModalOpen(false);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "create_at", label: "Created At" },
  ];

  const error = fetchError || addError;

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Topics</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <span>New Topic</span>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search topics..."
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
        <TopicsTable topics={filteredTopics} columns={columns} />
      )}

      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        onAddTopic={handleAddTopic}
        isLoading={isAdding}
      />
    </div>
  );
};

export default Topics;