import MainLayout from "../main/MainLayout";
const MainWrapper = ({ children }: any) => {
  return (
      <MainLayout>
        {children}
      </MainLayout>
  );
};

export default MainWrapper;
