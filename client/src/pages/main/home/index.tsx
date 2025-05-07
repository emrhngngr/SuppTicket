import React from "react";
import SearchContent from "./components/SearchContent";
import TopicsContent from "./components/TopicsContent";

const index = () => {
  return (
    <div>
      <div>
      <SearchContent />
      </div>
      <div>
        <TopicsContent/>
      </div>
    </div>
  );
};

export default index;
