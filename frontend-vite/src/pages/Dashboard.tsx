import UsersTable from "../components/tables/UsersTable";

const Dashboard: React.FC = () => {
  
  const userStringObj = localStorage.getItem("user");
  const userObj = userStringObj && JSON.parse(userStringObj);
  
  return (
    <section className="py-20 rounded-xl justify-center space-y-10 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium">Projects</h2>
      </div>
      <div className="">
        <UsersTable user={userObj} />
      </div>
    </section>
  );
};

export default Dashboard;
