import LineCharts from "@/components/common/charts/Line-chart";
import Attendence from "@/components/student/dashboard/attendence";
import { EllipsisVertical, Share2 } from "lucide-react";

function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-5 p-5 pt-0">
      {/* First */}
      <div className="rounded-2xl w-full h-[400px] bg-background dark:bg-sidebar-background border p-4 shadow-sm">
        <div className="w-full flex items-center gap-3">
          <p className="flex-1 text-base text-foreground font-semibold">
            Overall Information
          </p>
          <div className="p-2 bg-muted rounded-full cursor-pointer">
            <Share2 className="w-4 h-4 text-foreground" />
          </div>
          <div className="p-2 bg-muted rounded-full cursor-pointer">
            <EllipsisVertical className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </div>

      {/* Second */}
      <div className="rounded-2xl w-full h-[400px] bg-background dark:bg-sidebar-background border border-border p-4 shadow-sm">
        <LineCharts
          data={[
            { week: "1", score: 2 },
            { week: "1", score: 10 },
            { week: "1", score: 3 },
            { week: "1", score: 7 },
          ]}
          text="Weekly Progress"
          className="h-full"
        />
      </div>

      {/* Attendence */}
      <Attendence />

      {/* Upcoming reviews */}
    </div>
  );
}

export default Dashboard;