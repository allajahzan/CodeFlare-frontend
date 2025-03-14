import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { ChartPie, Download } from "lucide-react";
import { useContext } from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";

// Interface for Props
interface PropsType {
    data: any[];
    text: string;
    className: string;
}

// Interface for LineCharts
const LineCharts = ({ data, text, className }: PropsType) => {
    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    return (
        <div className="h-full w-full flex flex-col gap-2">
            <div className="flex items-center gap-3 w-full">
                <p className="flex-1 text-base text-foreground font-semibold truncate">
                    {text}
                </p>
                <div className="p-2 bg-muted rounded-full cursor-pointer">
                    <Download className="w-4 h-4 text-foreground" />
                </div>
                <div className="p-2 bg-muted rounded-full cursor-pointer">
                    <ChartPie className="w-4 h-4 text-foreground" />
                </div>
            </div>
            <div className={cn(className)}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        {/* Add a grid for a cleaner look */}
                        <CartesianGrid
                            stroke={theme === "dark" ? "#27272A" : "#e0e0e0"}
                            strokeDasharray="3 3"
                        />

                        {/* Add a Tooltip */}
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

                        {/* Line configuration */}
                        <Line
                            animationDuration={1000}
                            type="monotone"
                            dataKey="score"
                            stroke={theme === "dark" ? "#f5f5f5" : "#18181b"}
                            strokeWidth={2}
                            dot={{ stroke: "black", strokeWidth: 2, r: 4 }}
                            activeDot={{
                                r: 4,
                                stroke: theme === "dark" ? "#f5f5f5" : "#18181b",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineCharts;
