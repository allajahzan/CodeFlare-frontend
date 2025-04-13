import { useState } from "react";
// import { addMonths, subMonths } from "date-fns";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Table from "./table";

// Attendence list Component
function AttendenceList() {
    // Redux
    const role = useSelector((state: stateType) => state.role);

    // View state
    const [view, setView] = useState<"table-view" | "calender-view">(
        role === "student" ? "calender-view" : "table-view"
    );

    return (
        <div
            className={`w-full h-full flex flex-col gap-5 overflow-y-auto no-scrollbar p-5 pt-0`}
        >
            {/* Table */}
            {view === "table-view" && (
                <Table
                    view={view}
                    setView={setView}
                />
            )}
        </div>
    );
}

export default AttendenceList;
