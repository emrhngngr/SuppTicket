import React, { useEffect, useState } from "react";
import AddUserModal from "./components/AddUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import EditUserModal from "./components/EditUserModal";
import UsersTable from "./components/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const [userData, setUserData] = useState<{ users: User[] }>({ users: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Data could not be fetched");
      }

      const data = await response.json();
      setUserData({ users: data.users });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const columns = [
    {
      header: "ID",
      accessor: "id",
      sortable: true
    },
    {
      header: "Name",
      accessor: "name",
      sortable: true
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true
    },
    {
      header: "Actions", //! edit butonu çalışmıyor
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(row.original)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(row.original)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <UsersTable
        userData={userData}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onAdd={handleAddUser}
        onRefresh={handleRefresh}
        loading={loading}
        columns={columns}
      />

      {/* Modals */}
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onRefresh={handleRefresh}
      />
      
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        user={selectedUser}
        onRefresh={handleRefresh}
      />
      
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={fetchUsers}
        userRole={currentUser.role}
        userCompanyId={currentUser.companyId}
      />
    </div>
  );
};

export default UsersPage;