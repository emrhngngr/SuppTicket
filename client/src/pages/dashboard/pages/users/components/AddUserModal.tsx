import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface AddUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  companyId?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  userRole: string;
  userCompanyId?: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onRefresh,
  userRole,
  userCompanyId
}) => {
  const [addForm, setAddForm] = useState<AddUserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    companyId: userCompanyId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    if (isOpen && isSuperAdmin) {
      fetchCompanies();
    }
  }, [isOpen, isSuperAdmin]);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setAddForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        companyId: userCompanyId
      });
      setError(null);
      setValidationErrors({});
    }
  }, [isOpen, userCompanyId]);

  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      setCompanyError(null);
      
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch companies");
      }

      const data = await response.json();
      // Ensure data is an array
      const companiesArray = Array.isArray(data.data) ? data.data : [];
      setCompanies(companiesArray);
      console.log("companiesArray ==> ", companiesArray);
      
      // Set default company if companies are available
      if (companiesArray.length > 0 && !addForm.companyId) {
        setAddForm(prev => ({
          ...prev,
          companyId: companiesArray[0].id
        }));
      }
    } catch (err: any) {
      setCompanyError(err.message);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  if (!isOpen) return null;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const errors: {[key: string]: string} = {};
    
    if (!addForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!addForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(addForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!addForm.password) {
      errors.password = 'Password is required';
    } else if (addForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (addForm.password !== addForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (isSuperAdmin && !addForm.companyId) {
      errors.companyId = 'Company is required';
    }
    
    return errors;
  };

  const onSubmit = async () => {
    const errors = validate();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const { confirmPassword, ...userData } = addForm;
      
      // For non-super-admin users, always use their own company ID
      const finalData = isSuperAdmin ? userData : {
        ...userData,
        companyId: userCompanyId
      };
      
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Add New User</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={addForm.name}
                onChange={onInputChange}
                className={`mt-1 block w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={addForm.email}
                onChange={onInputChange}
                className={`mt-1 block w-full border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={addForm.role}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                {isSuperAdmin && <option value="super_admin">Super Admin</option>}
              </select>
            </div>
            
            {/* Company selection only for super admins */}
            {isSuperAdmin && (
              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">Company</label>
                {isLoadingCompanies ? (
                  <div className="mt-1 text-sm text-gray-500">Loading companies...</div>
                ) : companyError ? (
                  <div className="mt-1 text-sm text-red-600">{companyError}</div>
                ) : (
                  <select
                    id="companyId"
                    name="companyId"
                    value={addForm.companyId || ''}
                    onChange={onInputChange}
                    className={`mt-1 block w-full border ${validationErrors.companyId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select a company</option>
                    {companies && companies.length > 0 ? (
                      companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))
                    ) : (
                      <option value="" disabled>No companies available</option>
                    )}
                  </select>
                )}
                {validationErrors.companyId && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyId}</p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={addForm.password}
                onChange={onInputChange}
                className={`mt-1 block w-full border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={addForm.confirmPassword}
                onChange={onInputChange}
                className={`mt-1 block w-full border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;