import Sidebar from './Sidebar';
import Topbar from './Topbar';

import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;