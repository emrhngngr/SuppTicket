import React from "react";
import TopicCard from "./TopicCard";

const topics = [
  { id: "device", link: 'device', title: "Device Support", description: "Help with devices" },
  { id: "billing", link: 'billing', title: "Billing", description: "Payment issues" },
  { id: "account", link: 'account', title: "Account", description: "Login & settings" },
  { id: "software", link: 'software', title: "Software", description: "App-related help" },
  
  { id: "network", link: 'software',title: "Network", description: "Connectivity issues" },
  { id: "security", link: 'software',title: "Security", description: "Account security" },
  { id: "accessories", link: 'software',title: "Accessories", description: "Device accessories" },
  { id: "other", link: 'software',title: "Other", description: "General inquiries" },
];

const TopicsContent = () => {
  return (
    <div className="grid grid-cols-12 gap-4 mt-32">
      {topics.map((topic) => (
        <div key={topic.id} className="md:col-span-3 col-span-6">
          <TopicCard
            id={topic.id}
            title={topic.title}
            link={topic.link}
            description={topic.description}
          />
        </div>
      ))}
    </div>
  );
};

export default TopicsContent;
