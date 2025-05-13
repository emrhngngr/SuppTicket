import { Select } from "@radix-ui/react-select";
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTopic, setNewTopic] = useState<NewTopic>({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to continue.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("User data could not be fetched");
    }

    const userData = await response.json();
    console.log("userData ==> ", userData);


    const res = await fetch(`http://localhost:5000/api/topics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Veriler alınamadı");
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("API did not return an array");
    }

    setTopics(data);
  } catch (error) {
    console.error("Veri alınırken hata:", error);
    setError("Konular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı! Lütfen giriş yapın.");
      return;
    }

    fetchTableData();
  }, []);

  const filteredTopics = Array.isArray(topics)
    ? topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddTopic = async (
    e?: React.FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (e) e.preventDefault();
    setIsLoading(true);

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
        setNewTopic({ title: "", description: "" });
        setIsModalOpen(false);
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

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "description", label: "Açıklama" },
    { key: "createDate", label: "Oluşturma Tarihi" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Konular</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          <span>Yeni Konu</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Konularda ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500">Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                  >
                    {topics.length === 0
                      ? "Tabloda henüz konu yok."
                      : "Arama kriterlerine uygun konu bulunamadı."}
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => (
                  <tr key={topic.id}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                      >
                        {topic[col.key as keyof Topic]?.toString()}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">
              Yeni Konu Ekle
            </h3>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  value={newTopic.title}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Select value="getCategories"/> 
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Açıklama
                </label>
                <textarea
                  required
                  value={newTopic.description}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleAddTopic}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Ekleniyor..." : "Ekle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;