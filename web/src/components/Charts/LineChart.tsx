import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface propType {
  data : object[]
  text : string
}

const AdminDashboard = ({data,text}:propType) => {

  return (
    <div className="h-full w-full flex flex-col gap-10">
      <p className="text-base font-medium text-ellipsis overflow-hidden text-nowrap">{text}</p>
      <div className="h-[266px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
