import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const monthlyData = [
    { week: "1", score: 15 },
    { week: "2", score: 15 },
    { week: "3", score: 12 },
    { week: "4", score: 0 },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-10">
      <p className="text-base font-medium">Last 4 week's Performance Level</p>
      <div className="h-[266px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData.slice()}>
            <Line
              animationDuration={1000}
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
