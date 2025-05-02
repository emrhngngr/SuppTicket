import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, X } from 'lucide-react';
import GenericTable from '../../../../components/common/GenericTable';

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
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

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Company Manager</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <GenericTable
          data={data}
          columns={columns}
          emptyMessage="Company not found"
          onRowClick={handleRowClick}
          hoverable={true}
        />
      </div>

      {/* Company Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Company Details</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : selectedCompany ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{selectedCompany.id}</span>
                      
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedCompany.name}</span>
                      
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedCompany.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedCompany.status}
                      </span>
                      
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium">{formatDate(selectedCompany.created_at)}</span>
                      
                      <span className="text-gray-600">Updated At:</span>
                      <span className="font-medium">{formatDate(selectedCompany.updated_at)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">License Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-600">License ID:</span>
                      <span className="font-medium">{selectedCompany.license_id || '-'}</span>
                      
                      <span className="text-gray-600">License Type:</span>
                      <span className="font-medium">{selectedCompany.license_type || '-'}</span>
                      
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedCompany.start_date)}</span>
                      
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="font-medium">{formatDate(selectedCompany.expiry_date)}</span>
                      
                      <span className="text-gray-600">License Status:</span>
                      <span className={`font-medium ${
                        selectedCompany.license_status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedCompany.license_status || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                {selectedCompany.users && selectedCompany.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Users ({selectedCompany.users.length})</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedCompany.users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role_id === 1 ? 'Super Admin' : user.role_id === 2 ? 'Admin' : 'User'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* No Users Message */}
                {selectedCompany.users && selectedCompany.users.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No users found for this company
                  </div>
                )}

                <div className="mt-8 flex justify-end space-x-3">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      closeModal();
                      handleEditCompany(selectedCompany.id);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Edit Company
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-red-600">Company data could not be loaded</div>
            )}
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {isEditModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Company</h2>
              <button onClick={closeEditModal} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Company Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={editForm.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">License Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="license_type" className="block text-sm font-medium text-gray-700">License Type</label>
                        <select
                          id="license_type"
                          name="license_type"
                          value={editForm.license_type || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select License Type</option>
                          <option value="basic">Basic</option>
                          <option value="standart">Standart</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="license_status" className="block text-sm font-medium text-gray-700">License Status</label>
                        <select
                          id="license_status"
                          name="license_status"
                          value={editForm.license_status || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select License Status</option>
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          id="start_date"
                          name="start_date"
                          value={editForm.start_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="date"
                          id="expiry_date"
                          name="expiry_date"
                          value={editForm.expiry_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;