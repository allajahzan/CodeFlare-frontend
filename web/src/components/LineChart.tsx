import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const monthlyData = [
    { week: "1", score: 9 },
    { week: "2", score: 15 },
    { week: "3", score: 0 },
    { week: "5", score: 20 },
    { week: "6", score: 10 },
    { week: "7", score: 12 },
    { week: "8", score: 0 },
    { week: "9", score: 20 },
    { week: "10", score: 10 },
    { week: "11", score: 12 },
    { week: "12", score: 0 },
  ];  

  return (
    <div className="h-full w-full flex flex-col gap-10">
      <p className="text-base font-medium">Weekly Performance Level</p>
      <div className="h-[266px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <Line
              animationDuration={3000}
              type="monotone"
              dataKey="score"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
