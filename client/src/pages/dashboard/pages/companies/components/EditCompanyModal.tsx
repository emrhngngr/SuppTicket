import React from 'react';
import { X } from 'lucide-react';

interface EditFormType {
  name: string;
  status: string;
  license_type: string;
  start_date: string;
  expiry_date: string;
  license_status: string;
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
}

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  isLoading: boolean;
  isSaving: boolean;
  editForm: EditFormType;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ 
  isOpen, 
  onClose, 
  company, 
  isLoading, 
  isSaving, 
  editForm, 
  onInputChange, 
  onSave 
}) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Edit Company</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
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
                      onChange={onInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editForm.status}
                      onChange={onInputChange}
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
                      onChange={onInputChange}
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
                      onChange={onInputChange}
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
                      onChange={onInputChange}
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
                      onChange={onInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
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
                onClick={onSave}
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
  );
};

export default EditCompanyModal;