import { CalendarDaysIcon, ScanEye, Search } from "lucide-react";
import DatePicker from "@/components/instructor/reviews/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import SearchAttendence from "./search-attendence";
import { SelectValue } from "@radix-ui/react-select";
import { IStudent } from "@/types/student";
import { IBatch } from "@/types/batch";
import Filter from "@/components/common/data-card/filter";

// Interface for Props
interface Propstype {
    view: "lists-view" | "analysis-view";
    setView: React.Dispatch<React.SetStateAction<"lists-view" | "analysis-view">>;

    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    selectedBatch: IBatch | null;
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
    selectedStudent: string | "";
    setSelectedStudent: React.Dispatch<React.SetStateAction<string | "">>;

    students: [] | IStudent[];
    fetchingStudents: boolean;

    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string | "">>;
}

// Calendeer header Component
function Header({
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

    selectedStatus,
    setSelectedStatus,
}: Propstype) {
    return (
        <div
            style={{ willChange: "transform" }}
            className="sticky top-0 z-30 rounded-b-xl"
        >
            <div className="flex items-center justify-between p-0">
                {/* Buttons */}
                <div className="flex gap-1 w-full">
                    {/* Select Date */}

                    <div className="relative min-w-0 w-full sm:col-span-2 lg:col-span-1">
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
                                className="w-full text-foreground font-medium p-5 pl-9 rounded-lg cursor-pointer bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
                            >
                                <SelectValue placeholder="Select date">
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
                                className="bg-transparent border-none shadow-none p-0 relative left-1 rounded-lg"
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

                    {/* Search modal */}
                    <Select>
                        <SelectTrigger
                            title="Search"
                            className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none"
                        >
                            <Search className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent className="w-[220px]" align="end">
                            <SearchAttendence
                                selectedBatch={selectedBatch}
                                setSelectedBatch={setSelectedBatch}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                students={students}
                                fetchingStudents={fetchingStudents}
                            />
                        </SelectContent>
                    </Select>

                    {/* Filter */}
                    <Filter
                        title="Status"
                        filter={selectedStatus}
                        setFilter={setSelectedStatus}
                        fitlerData={["All", "Pending", "Present", "Absent", "Late"]}
                    />

                    {/* View selecter */}
                    <Select
                        onValueChange={(value: "lists-view" | "analysis-view") =>
                            setView(value)
                        }
                        value={view}
                    >
                        <SelectTrigger
                            title="View"
                            className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none"
                        >
                            <ScanEye className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="lists-view">Attendence list</SelectItem>
                            <SelectItem value="analysis-view">Monthly analysis</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

export default Header;
