import React from "react";

const BillingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Billing Support</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Issues</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Failed Payments</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If your payment was declined:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Check that your card details are correct</li>
              <li>Ensure your card hasn't expired</li>
              <li>Verify you have sufficient funds</li>
              <li>Contact your bank to authorize transactions</li>
            </ul>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Subscription Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To manage your subscription:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>View your current plan in account settings</li>
              <li>Change payment methods in billing settings</li>
              <li>Upgrade or downgrade your subscription</li>
              <li>Cancel auto-renewal if needed</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Refund Requests</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For refund information:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
              <li>Refunds are processed within 5-7 business days</li>
              <li>Check our refund policy for eligibility</li>
              <li>Fill out the refund request form</li>
              <li>Contact customer support for assistance</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Billing FAQ</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-1">When am I charged?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Subscriptions are charged at the beginning of each billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">Can I change my plan?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can change your plan at any time. Changes take effect on your next billing date.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">What payment methods do you accept?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept major credit cards, PayPal, and bank transfers in some regions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Billing Support</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Need more help with billing issues? Our support team is ready to assist you.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Contact Billing Support
        </button>
      </div>
    </div>
  );
};

export default BillingPage;