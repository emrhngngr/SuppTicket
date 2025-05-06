import React from "react";
import PrivateRoute from "../../../routes/privateRoute";
import DashboardLayout from "./DashboardLayout";

const DashboardWrapper = ({ children }: any) => {
  return (
    <PrivateRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default DashboardWrapper;
