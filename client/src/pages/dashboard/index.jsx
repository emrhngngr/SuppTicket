import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.token); 

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>Hoşgeldiniz, {user.name}</h2>
        </div>
      ) : (
        <p>Kullanıcı girişi yapılmamış.</p>
      )}
    </div>
  );
};

export default Dashboard;
