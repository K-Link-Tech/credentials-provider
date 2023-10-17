import UsersTable from "../components/tables/UsersTable";

const Dashboard: React.FC = () => {
  return (
    <section className="py-20 rounded-xl space-y-10 bg-white align-element">
      <div className="border-b border-black pb-4">
        <h2 className="text-3xl font-medium">Projects</h2>
      </div>
      <div>
        <UsersTable />
      </div>
    </section>
  );
};

export default Dashboard;
