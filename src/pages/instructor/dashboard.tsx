// Instructor Dashboard
function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-5 pt-0">
      <div className="rounded-2xl w-full h-[400px] bg-muted dark:bg-background border border-customBorder p-4 shadow-sm dark:shadow-customBorder dark:shadow-inner"></div>
      <div className="rounded-2xl w-full h-[400px] bg-muted dark:bg-background border border-customBorder p-4 shadow-sm dark:shadow-customBorder dark:shadow-inner"></div>
      <div className="rounded-2xl w-full h-[400px] bg-muted dark:bg-background border border-customBorder p-4 shadow-sm dark:shadow-customBorder dark:shadow-inner col-span-3"></div>
    </div>
  );
}

export default Dashboard;
