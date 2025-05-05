import React from 'react';
import { X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

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
  users?: User[];
}

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  isLoading: boolean;
  onEdit: (id: number) => void;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  company, 
  isLoading, 
  onEdit 
}) => {
  if (!isOpen) return null;

  // Format date for display
  const formatDate = (dateString: any) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Company Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : company ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{company.id}</span>
                  
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{company.name}</span>
                  
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    company.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.status}
                  </span>
                  
                  <span className="text-gray-600">Created At:</span>
                  <span className="font-medium">{formatDate(company.created_at)}</span>
                  
                  <span className="text-gray-600">Updated At:</span>
                  <span className="font-medium">{formatDate(company.updated_at)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">License Information</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-gray-600">License ID:</span>
                  <span className="font-medium">{company.license_id || '-'}</span>
                  
                  <span className="text-gray-600">License Type:</span>
                  <span className="font-medium">{company.license_type || '-'}</span>
                  
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(company.start_date)}</span>
                  
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">{formatDate(company.expiry_date)}</span>
                  
                  <span className="text-gray-600">License Status:</span>
                  <span className={`font-medium ${
                    company.license_status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.license_status || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Users Table */}
            {company.users && company.users.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Users ({company.users.length})</h3>
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
                      {company.users.map((user) => (
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
            {company.users && company.users.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No users found for this company
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  onClose();
                  onEdit(company.id);
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
  );
};

export default CompanyDetailModal;