// Admin Dashboard
function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-5 pt-0">
      <div className="rounded-3xl w-full h-[400px] bg-background border border-customBorder p-4"></div>
      <div className="rounded-3xl w-full h-[400px] bg-background border border-customBorder p-4"></div>
      <div className="rounded-3xl w-full h-[400px] bg-background border border-customBorder p-4 col-span-3"></div>
    </div>
  );
}

export default Dashboard;
