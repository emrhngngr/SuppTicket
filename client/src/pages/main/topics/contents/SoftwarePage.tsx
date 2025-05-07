import React from "react";

const SoftwarePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Software Support</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Application Issues</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">App Not Loading</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If the application won't start:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Restart the application</li>
              <li>Check for system updates</li>
              <li>Clear app cache and data</li>
              <li>Reinstall the application</li>
            </ul>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Performance Problems</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For slow or laggy performance:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Close other running applications</li>
              <li>Check your internet connection</li>
              <li>Update to the latest version</li>
              <li>Check hardware requirements</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Feature Not Working</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If a specific feature isn't working:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Check app permissions</li>
              <li>Look for feature-specific settings</li>
              <li>Verify your subscription includes the feature</li>
              <li>Contact support for assistance</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Software Updates</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Keeping your software updated ensures you have the latest features and security patches.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-1">How to Update</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Go to Settings About  Check for Updates to get the latest version.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">Update Frequency</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We release updates approximately once per month, with critical security updates as needed.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">Beta Program</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join our beta program to test new features before they're officially released.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Software Support</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Need more help with our software? Our technical support team is ready to assist you.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Contact Technical Support
        </button>
      </div>
    </div>
  );
};

export default SoftwarePage;