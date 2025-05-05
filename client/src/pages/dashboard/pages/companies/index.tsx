import React, { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import GenericTable from '../../../../components/common/GenericTable';
import CompanyDetailModal from './components/CompanyDetailModal';
import EditCompanyModal from './components/EditCompanyModal';
import CreateCompanyModal from './components/CreateCompanyModal';

interface Company {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  license_id: number | null;
  license_type: string | null;
  start_date: string | null;
  expiry_date: string | null;
  license_status: string | null;
  user_count: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

interface CompanyWithUsers extends Company {
  users?: User[];
}

interface Column {
  header: string;
  accessor?: keyof Company;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  cell?: (row: Company) => React.ReactNode;
}

const CompanyPage: React.FC = () => {
  const [data, setData] = useState<Company[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithUsers | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: '',
    status: '',
    license_type: '',
    start_date: '',
    expiry_date: '',
    license_status: ''
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    status: 'active',
    license_type: '',
    start_date: '',
    expiry_date: ''
  });

  // Fetch all companies data
  const fetchCompanies = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/companies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Veri alınamadı');
        }
        return res.json();
      })
      .then((resData) => {
        const companies: Company[] = resData.data;

        const cols: Column[] = [
          { header: 'ID', accessor: 'id', sortable: true },
          { header: 'Company Name', accessor: 'name', sortable: true },
          { header: 'License Type', accessor: 'license_type', sortable: true },
          { header: 'License Status', accessor: 'license_status', sortable: true },
          { header: 'Start Date', accessor: 'start_date', sortable: true },
          { header: 'Expiry Date', accessor: 'expiry_date', sortable: true },
          { header: 'User Count', accessor: 'user_count', sortable: true, align: 'center' },
          { header: 'Status', accessor: 'status', sortable: true },
          {
            header: 'Actions',
            sortable: false,
            align: 'right',
            cell: (row: Company) => (
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCompany(row.id);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ),
          },
        ];

        setData(companies);
        setColumns(cols);
      })
      .catch((error) => {
        console.error('Şirket verisi alınırken hata:', error);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle row click to view company details
  const handleRowClick = (row: Company) => {
    handleViewCompany(row.id);
  };

  // Fetch company details by ID
  const handleViewCompany = async (id: number) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Şirket detayları alınamadı');
      }

      const result = await response.json();
      setSelectedCompany(result.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Şirket detayı alınırken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit company
  const handleEditCompany = async (id: number) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Şirket detayları alınamadı');
      }

      const result = await response.json();
      const company = result.data;
      
      setSelectedCompany(company);
      
      // Initialize edit form with company data
      setEditForm({
        name: company.name || '',
        status: company.status || '',
        license_type: company.license_type || '',
        start_date: company.start_date ? new Date(company.start_date).toISOString().split('T')[0] : '',
        expiry_date: company.expiry_date ? new Date(company.expiry_date).toISOString().split('T')[0] : '',
        license_status: company.license_status || ''
      });
      
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Şirket detayı alınırken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for create form
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!selectedCompany) return;
    
    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${selectedCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          status: editForm.status,
          licenseType: editForm.license_type,
          startDate: editForm.start_date,
          expiryDate: editForm.expiry_date,
          licenseStatus: editForm.license_status
        })
      });

      if (!response.ok) {
        throw new Error('Şirket güncellenemedi');
      }

      // Update the company in the data array
      setData(prevData => prevData.map(company => {
        if (company.id === selectedCompany.id) {
          return {
            ...company,
            name: editForm.name,
            status: editForm.status,
            license_type: editForm.license_type,
            start_date: editForm.start_date,
            expiry_date: editForm.expiry_date,
            license_status: editForm.license_status
          };
        }
        return company;
      }));

      // Close the edit modal
      setIsEditModalOpen(false);
      
      // Refresh data
      fetchCompanies();
      
      alert('Company updated successfully!');
    } catch (error) {
      console.error('Şirket güncellenirken hata:', error);
      alert('Error updating company. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle create company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: createForm.name,
          status: createForm.status,
          licenseType: createForm.license_type,
          startDate: createForm.start_date,
          expiryDate: createForm.expiry_date
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create company');
      }

      // Clear the form
      setCreateForm({
        name: '',
        status: 'active',
        license_type: '',
        start_date: '',
        expiry_date: ''
      });

      // Close the create modal
      setIsCreateModalOpen(false);
      
      // Refresh data
      fetchCompanies();
      
      alert('Company created successfully!');
    } catch (error) {
      console.error('Error creating company:', error);
      alert(error instanceof Error ? error.message : 'Error creating company. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete company
  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }
    
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Şirket silinemedi');
      }

      // Remove the company from the data array
      setData(prev => prev.filter(c => c.id !== id));
      alert('Company deleted successfully!');
    } catch (error) {
      console.error('Şirket silinirken hata:', error);
      alert('Error deleting company. Please try again.');
    }
  };

  // Open create company modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close modals
  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Custom action for the create company button
  const actions = [
    {
      label: 'Create Company',
      onClick: openCreateModal,
      icon: <Plus />
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Company Manager</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <GenericTable
          data={data.filter(company => company.id !== 0)}
          columns={columns}
          emptyMessage="Company not found"
          onRowClick={handleRowClick}
          hoverable={true}
          actions={actions}
        />
      </div>

      {/* Company Detail Modal Component */}
      <CompanyDetailModal
        isOpen={isModalOpen}
        onClose={closeDetailModal}
        company={selectedCompany}
        isLoading={isLoading}
        onEdit={handleEditCompany}
      />

      {/* Edit Company Modal Component */}
      <EditCompanyModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        company={selectedCompany}
        isLoading={isLoading}
        isSaving={isSaving}
        editForm={editForm}
        onInputChange={handleEditInputChange}
        onSave={handleSaveChanges}
      />

      {/* Create Company Modal Component */}
      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        isLoading={false}
        isSaving={isSaving}
        createForm={createForm}
        onInputChange={handleCreateInputChange}
        onSubmit={handleCreateCompany}
      />
    </div>
  );
};

export default CompanyPage;