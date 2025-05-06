import PrivateRoute from "../../../routes/privateRoute";
import MainLayout from "../main/MainLayout";
const MainWrapper = ({ children }: any) => {
  return (
    <PrivateRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </PrivateRoute>
  );
};

export default MainWrapper;
