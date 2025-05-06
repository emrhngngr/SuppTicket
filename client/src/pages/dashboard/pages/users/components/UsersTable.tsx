import GenericTable from "@/components/common/GenericTable"; // Adjust the import path as needed
import { RefreshCw, UserPlus } from "lucide-react";
import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserData {
  users: User[];
}

interface UsersTableProps {
  userData: UserData;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  columns: any[]; // Adjust the type as needed for your column definitions
}

const UsersTable: React.FC<UsersTableProps> = ({
  userData,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
  loading,
  columns,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Table actions
  const tableActions = [
    {
      label: "Yeni Kullanıcı",
      onClick: onAdd,
      icon: <UserPlus className="h-4 w-4 mr-2" />,
    },
    {
      label: "Yenile",
      onClick: onRefresh,
      icon: <RefreshCw className="h-4 w-4 mr-2" />,
    },
  ];

  useEffect(() => {
    console.log("columns ==> ", columns);
  
  }, [])
  

  // Handle search
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h2>
        
        <GenericTable
          data={userData.users || []}
          columns={columns}
          pagination={true}
          initialPageSize={pageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          searchable={true}
          sortable={true}
          emptyMessage="Kullanıcı bulunamadı"
          loading={loading}
          selectable={false}
          actions={tableActions}
          striped={true}
          hoverable={true}
          bordered={false}
          dense={false}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={handleSearchChange}
          onSortChange={(column, direction) => {
            // You can implement server-side sorting here if needed
            console.log(`Sorting by ${column} in ${direction} order`);
          }}
        />
      </div>
    </div>
  );
};

export default UsersTable;