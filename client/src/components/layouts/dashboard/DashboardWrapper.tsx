import React from "react";
import DashboardLayout from "./DashboardLayout";

const DashboardWrapper = ({ children }: any) => {
  return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
  );
};

export default DashboardWrapper;
