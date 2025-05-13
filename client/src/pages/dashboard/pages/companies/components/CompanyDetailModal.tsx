import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const formatDate = (date?: string | null) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('tr-TR');
};

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
  isLoading,
  onEdit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-b-transparent border-primary" />
          </div>
        ) : !company ? (
          <p className="text-center text-red-600">Company data could not be loaded</p>
        ) : (
          <div className="space-y-6">
            {/* Company Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Company Information</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">ID:</span>
                  <span>{company.id}</span>
                  <span className="text-muted-foreground">Name:</span>
                  <span>{company.name}</span>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={company.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                    {company.status}
                  </span>
                  <span className="text-muted-foreground">Created At:</span>
                  <span>{formatDate(company.created_at)}</span>
                  <span className="text-muted-foreground">Updated At:</span>
                  <span>{formatDate(company.updated_at)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">License Information</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">License ID:</span>
                  <span>{company.license_id ?? '-'}</span>
                  <span className="text-muted-foreground">License Type:</span>
                  <span>{company.license_type ?? '-'}</span>
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{formatDate(company.start_date)}</span>
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span>{formatDate(company.expiry_date)}</span>
                  <span className="text-muted-foreground">License Status:</span>
                  <span className={company.license_status === 'active' ? 'text-green-600' : 'text-red-600'}>
                    {company.license_status ?? '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                Users ({company.users?.length || 0})
              </h3>
              {company.users && company.users.length > 0 ? (
                <ScrollArea className="max-h-[300px] border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.role_id === 1
                              ? 'Super Admin'
                              : user.role_id === 2
                              ? 'Admin'
                              : 'User'}
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No users found for this company
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  onEdit(company.id);
                }}
              >
                Edit Company
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailModal;
