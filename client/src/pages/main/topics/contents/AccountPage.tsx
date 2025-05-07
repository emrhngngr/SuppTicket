import React from "react";

const AccountPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Support</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Management</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Login Issues</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If you're having trouble logging in:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Check your username and password</li>
              <li>Reset your password if needed</li>
              <li>Ensure your account is activated</li>
              <li>Clear browser cookies and cache</li>
            </ul>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Profile Settings</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To manage your profile:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Update personal information</li>
              <li>Change email preferences</li>
              <li>Manage linked accounts</li>
              <li>Set privacy options</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Account Security</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For account security:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Enable two-factor authentication</li>
              <li>Review recent login activity</li>
              <li>Update security questions</li>
              <li>Report suspicious activity</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Recovery</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Lost access to your account? Follow these steps:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
          <li>Click on "Forgot Password" on the login page</li>
          <li>Enter the email associated with your account</li>
          <li>Check your email for recovery instructions</li>
          <li>Follow the link to reset your password</li>
          <li>Create a new, secure password</li>
        </ol>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Account Support</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Need more help with your account? Our support team is ready to assist you.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Contact Account Support
        </button>
      </div>
    </div>
  );
};

export default AccountPage;