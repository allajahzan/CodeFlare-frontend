import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Download } from "lucide-react";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Interface for Props
interface PorpsType {
  title: string;
  data: any[];
}

// Ratio chart Component
function RatioChart({ title, data }: PorpsType) {
  return (
    <div className="h-[400px] bg-background dark:bg-sidebar-background border border-border rounded-2xl shadow-sm flex flex-col p-5">
      {/* Header */}
      <div className="w-full flex items-center gap-3 mb-2">
        <p className="flex-1 text-lg text-foreground font-semibold">{title}</p>
        <div className="p-2 bg-muted rounded-full cursor-pointer">
          <Download className="w-4 h-4 text-foreground" />
        </div>
      </div>

      {/* Chart Container */}
      <ChartContainer config={chartConfig} className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            endAngle={100}
            innerRadius="60%"
            outerRadius="90%"
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {data[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Ratio
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

export default RatioChart;
