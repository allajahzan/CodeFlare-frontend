import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useContext } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

// Interface for Props
interface PropsType {
    data: any[];
    text: string;
    className: string;
    radius?: number;
}

const PieCharts = ({ data, text, className, radius }: PropsType) => {
    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // Colors for the Pie Chart
    const COLORS = [
        "rgba(202, 168, 4, 1)", // yellow-600
        "rgba(22, 163, 74, 1)", // green-600
        "rgba(220, 38, 38, 1)", // red-600
        "rgba(30, 64, 175, 1)", // blue-600
    ];

    return (
        <div className="h-full w-full flex flex-col space-y-3">
            <div className="flex items-center gap-3 w-full">
                <p className="flex-1 text-base text-foreground font-semibold truncate">
                    {text}
                </p>
                <div className="p-2 bg-muted rounded-full cursor-pointer">
                    <Download className="w-4 h-4 text-foreground" />
                </div>
                {/* <div className="p-2 bg-muted rounded-full cursor-pointer">
                    <ChartPie className="w-4 h-4 text-foreground" />
                </div> */}
            </div>
            <div className={cn(className)}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Tooltip for Hover */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                padding: "10px",
                                fontSize: "14px",
                                border: "1px solid #e5e5e5",
                            }}
                            itemStyle={{ color: "#374151" }}
                        />

                        {/* Pie Chart */}
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={radius ? radius : 78}
                            fill={theme === "dark" ? "#f5f5f5" : "#18181b"}
                            label
                            isAnimationActive={true}
                            animationDuration={1000}
                            animationEasing="ease-in-out"
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieCharts;
