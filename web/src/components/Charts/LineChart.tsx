// import {
//   LineChart,
//   Line,
//   ResponsiveContainer,
// } from "recharts";

// interface PropsType {
//   data : object[]
//   text : string
// }

// const AdminDashboard = ({data,text}:PropsType) => {

//   return (
//     <div className="h-full w-full flex flex-col gap-10">
//       <p className="text-base font-medium text-ellipsis overflow-hidden text-nowrap">{text}</p>
//       <div className="h-[170px] sm:h-[266px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <Line
//               animationDuration={3000}
//               type="monotone"
//               dataKey="score"
//               stroke="#000000"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PropsType {
  data: object[];
  text: string;
}

const LineCharts = ({ data, text }: PropsType) => {
  return (
    <div className="h-full w-full flex flex-col gap-10">
      <p className="text-base font-medium truncate">{text}</p>
      <div className="h-[170px] sm:h-[266px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Add a grid for a cleaner look */}
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

            {/* Add a Tooltip */}
            <Tooltip 
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                fontSize: "14px",
                border : '1px solid #e5e5e5'
              }}
              itemStyle={{ color: "#374151" }}
            />
            
            {/* Line configuration */}
            <Line
              animationDuration={3000}
              type="monotone"
              dataKey="score"
              stroke="#18181b"
              strokeWidth={2}
              dot={{ stroke: "black", strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 4, stroke: "#18181b", strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineCharts;
