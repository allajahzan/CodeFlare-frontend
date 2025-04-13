import { CalendarDaysIcon, Filter, ScanEye } from "lucide-react";
import DatePicker from "@/components/instructor/reviews/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import FilterAttendence from "./filter";
import { SelectValue } from "@radix-ui/react-select";
import { IStudent } from "@/types/student";
import { IBatch } from "@/types/batch";

// Interface for Props
interface Propstype {
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;

    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    selectedBatch: IBatch | null;
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
    selectedStudent: string | "";
    setSelectedStudent: React.Dispatch<React.SetStateAction<string | "">>;

    students: [] | IStudent[];
    fetchingStudents: boolean;
}

// Calendeer header Component
function CalenderHeader({
    view,
    setView,

    selectedDate,
    setSelectedDate,
    selectedBatch,
    setSelectedBatch,
    selectedStudent,
    setSelectedStudent,

    students,
    fetchingStudents,
}: Propstype) {
    return (
        <div
            className={`${view === "calender-view" && "bg-background dark:bg-sidebar-background"
                } sticky top-0 z-30 rounded-b-xl`}
        >
            <div
                className={`flex items-center justify-between ${view === "calender-view"
                        ? "w-full p-5 py-3 border shadow-sm rounded-xl "
                        : "p-0"
                    }`}
            >
                {/* Buttons */}
                <div className={`flex gap-1 ${view === "table-view" && "w-full"}`}>
                    {/* Select Date */}
                    {view === "table-view" && (
                        <div className="relative w-full sm:col-span-2 lg:col-span-1">
                            <Select
                                value={
                                    selectedDate
                                        ? new Date(selectedDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : ""
                                }
                            >
                                <SelectTrigger
                                    title="Date"
                                    className="w-full text-foreground font-medium p-5 pl-9 cursor-pointer bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
                                >
                                    <SelectValue placeholder="Select date" className="truncate">
                                        {selectedDate
                                            ? new Date(selectedDate).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "Select date"}
                                    </SelectValue>
                                    <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-transparent border-none shadow-none p-0 relative left-1"
                                    align="end"
                                >
                                    <DatePicker
                                        isDatePickerOpen={true}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        className="w-[252px] bg-background rounded-lg shadow-lg border"
                                    />
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Filter modal */}
                    <Select>
                        <SelectTrigger
                            title="Filter"
                            className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none"
                        >
                            <Filter className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent className="w-[220px]" align="end">
                            <FilterAttendence
                                selectedBatch={selectedBatch}
                                setSelectedBatch={setSelectedBatch}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                students={students}
                                fetchingStudents={fetchingStudents}
                            />
                        </SelectContent>
                    </Select>

                    {/* View selecter */}

                    <Select
                        onValueChange={(value: "table-view" | "calender-view") =>
                            setView(value)
                        }
                        value={view}
                    >
                        <SelectTrigger
                            title="View"
                            className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none"
                        >
                            <ScanEye className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="table-view">Table</SelectItem>
                            <SelectItem value="calender-view">Calender</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

export default CalenderHeader;
