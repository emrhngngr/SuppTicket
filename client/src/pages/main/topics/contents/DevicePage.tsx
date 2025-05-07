import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CreateTicketDialog from "@/pages/main/tickets/CreateTicketDialog";

const DevicePage = () => {
  const location = useLocation();
  const locationData = location.state || {};
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  const handleOpenTicketDialog = () => {
    setIsCreateTicketOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setIsCreateTicketOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Device Support</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Common Device Issues</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Device not turning on</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If your device won't turn on, try these steps:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Make sure the device is charged</li>
              <li>Hold the power button for 10-15 seconds</li>
              <li>Try a different power cable or outlet</li>
              <li>Check for physical damage</li>
            </ul>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Screen issues</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For screen-related problems:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Check brightness settings</li>
              <li>Test if touch functions work</li>
              <li>Look for cracks or physical damage</li>
              <li>Perform a soft reset</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Battery problems</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For battery-related issues:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Check battery health in settings</li>
              <li>Close background apps</li>
              <li>Turn off features you're not using</li>
              <li>Consider battery replacement if it's old</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Still having issues with your device? Our support team is here to help.
        </p>
        <Button onClick={handleOpenTicketDialog}>
          Create Ticket
        </Button>
      </div>
      
      <CreateTicketDialog 
        isOpen={isCreateTicketOpen} 
        onClose={handleCloseTicketDialog}
        deviceInfo={locationData} 
      />
    </div>
  );
};

export default DevicePage;