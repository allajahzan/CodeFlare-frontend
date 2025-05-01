import LineCharts from "@/components/common/charts/Line-chart";
import Attendence from "@/components/student/dashboard/attendence/attendence";
import OverallInformation from "./overall-infomation/overall-information";
import RatioChart from "@/components/common/charts/ration-chart";

// Student Dashboard Component
function Dashboard() {
    return (
        <div className="grid grid-cols-3 gap-5 p-5 pt-0">
            {/* Overall information */}
            <OverallInformation />

            {/* Second */}
            <div className="w-full h-[400px] p-5 bg-background dark:bg-sidebar-background border border-border rounded-2xl shadow-sm">
                <LineCharts
                    data={[
                        { week: "1", score: 2 },
                        { week: "1", score: 10 },
                        { week: "1", score: 3 },
                        { week: "1", score: 7 },
                    ]}
                    text="Montly Progress"
                    className="h-full"
                    pieChart={true}
                />
            </div>

            {/* Attendence */}
            <Attendence />

            {/* Upcoming reviews */}
            <div className="w-full h-[400px] shadow-sm grid grid-rows-2 gap-5">
                <div className="h-full p-5 bg-muted dark:bg-sidebar-background rounded-2xl "></div>

                <div className="h-full p-5 bg-muted dark:bg-sidebar-background rounded-2xl "></div>
            </div>

            <RatioChart
                title="Course completion ratio"
                data={[{ visitors: "80%", fill: "black" }]}
            />

            <div className="w-full h-[400px] p-5 bg-background dark:bg-sidebar-background border border-border rounded-2xl shadow-sm"></div>
        </div>
    );
}

export default Dashboard;
