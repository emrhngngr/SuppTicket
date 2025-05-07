import React from 'react';
import Navbar from './Navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen container mx-auto">
      <Navbar />
      <main className="flex-grow ">
        {children}
      </main>
    </div>
  );
};

export default LandingLayout;