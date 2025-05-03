import LineCharts from "@/components/common/charts/Line-chart";
import Attendence from "@/components/student/dashboard/attendence/attendence";
import OverallInformation from "@/components/student/dashboard/overall-infomation/overall-information";
import RadialChart from "@/components/common/charts/radial-chart";
import DashboardCard from "@/components/common/other-card/dashboard-card";
import DateAndTime from "@/components/common/other-card/date-time-card";
import WeatherCard from "@/components/common/other-card/weather-card";
import UpcomingReview from "./upcoming/review";
import student from "@/assets/images/student.png";
import CardHeader from "@/components/common/data-toolbar/header";
import SmallIconButton from "@/components/ui/icon-button-small";
import { ArrowUpRight } from "lucide-react";

// Student Dashboard Component
function Dashboard() {
    return (
        <div className="grid grid-cols-3 gap-5 p-5 pt-0">
            {/* Overall information */}
            <OverallInformation />

            <div className="w-full h-[400px] grid grid-rows-2 gap-5">
                {/* First row */}
                <div className="h-full grid grid-cols-2 gap-5">
                    {/* Image */}
                    <div className="bg-muted dark:bg-sidebar rounded-2xl overflow-hidden">
                        <img
                            className="w-full h-full object-contain"
                            src={student}
                            alt=""
                        />
                    </div>

                    {/* Weather */}
                    <div className="relative h-full p-5 bg-muted dark:bg-sidebar rounded-2xl">
                        <WeatherCard />
                    </div>
                </div>

                {/* Second row */}
                <div className="h-full grid grid-cols-2 gap-5">
                    {/* Tasks */}
                    <div className="bg-muted dark:bg-sidebar rounded-2xl h-full p-5">
                        <CardHeader
                            heading="Weekly Tasks"
                            children={
                                <SmallIconButton
                                    Icon={ArrowUpRight}
                                    className="bg-zinc-200 dark:bg-muted"
                                />
                            }
                        />
                    </div>

                    {/* Attendence */}
                    <div className="h-full p-5 bg-muted dark:bg-sidebar rounded-2xl">
                        <Attendence />
                    </div>
                </div>
            </div>

            {/* Date and time */}
            <DateAndTime />

            {/* Upcomings  */}
            <div className="w-full h-[400px] grid grid-rows-[auto_1fr] gap-5">
                {/* Review */}
                <UpcomingReview />

                <div className="w-full h-full"></div>
            </div>

            {/* Monthly performance */}
            <DashboardCard
                content={
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
                }
            />

            {/* Course completion ratio */}
            <DashboardCard
                content={
                    <RadialChart
                        title="Course completion ratio"
                        subTitle="January 2024 - May 2025"
                        percentage={20}
                        footer="Up by 5.2% compared to last month"
                        subFooter="Overall course completion progress"
                    />
                }
            />
        </div>
    );
}

export default Dashboard;
