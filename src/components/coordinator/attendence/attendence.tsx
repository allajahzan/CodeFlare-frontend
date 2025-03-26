import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Table from "./table";

// // Sample attendance data
// const attendanceData: Record<string, any> = {
//     "2025-03-19": {
//         date: "2025-03-13",
//         status: "absent",
//         notes: "Sick leave",
//         start: "2025-03-14T09:00",
//         end: "05:30 pm",
//     },
//     "2025-03-20": {
//         date: "2025-03-14",
//         status: "present",
//         notes: "On time",
//         start: "09:000 am",
//         end: "05:30 pm",
//     },
//     "2025-03-21": {
//         date: "2025-03-15",
//         status: "pending",
//         notes: "Joined 30 minutes late",
//         start: "09:000 am",
//         end: "pending",
//     },
// };

// Attendence list Component
function AttendenceList() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // View state
    const [view, setView] = useState<"table-view" | "calender-view">(
        role === "student" ? "calender-view" : "table-view"
    );

    //  Previous month
    const handlePreviousMonth = () => {
        setCurrentDate((prev) => subMonths(prev, 1));
    };

    // Next month
    const handleNextMonth = () => {
        setCurrentDate((prev) => addMonths(prev, 1));
    };

    return (
        <div
            className={`w-full h-full flex flex-col gap-5 overflow-y-auto no-scrollbar p-5 pt-0`}
        >
            {/* Table */}
            {view === "table-view" && (
                <Table
                    currentDate={currentDate}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                    view={view}
                    setView={setView}
                />
            )}
        </div>
    );
}

export default AttendenceList;
