import { useState } from "react";
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
        <>
            {/* Table */}
            {view === "table-view" && <Table view={view} setView={setView} />}
        </>
    );
}

export default AttendenceList;
