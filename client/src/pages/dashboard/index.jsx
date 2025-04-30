const Dashboard = () => {
  const user = localStorage.getItem('user')
  const parsedUser = JSON.parse(user)
  console.log("user ==> ", user);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {parsedUser.data.name}</h2>
        </div>
      ) : (
        <p>Kullanıcı girişi yapılmamış.</p>
      )}
    </div>
  );
};

export default Dashboard;
