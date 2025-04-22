import type React from "react";
import { useState } from "react";
import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ScanEye,
    Search,
} from "lucide-react";
import CardHeader from "@/components/common/data-card/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import SearchAttendence from "./search-attendence";
import { IBatch } from "@/types/batch";
import { IStudent } from "@/types/student";
import { IAttendence } from "@/types/attendence";
import Filter from "@/components/common/data-card/filter";
import SelectYear from "../../common/select/year-selector";
import SelectMonth from "@/components/common/select/month-selector";

// Student data interface
interface StudentRecord {
    id: string;
    date: string;
    batch: string;
    student: string;
    checkIn: string;
    checkOut: string;
    status: "present" | "absent" | "late";
}

// Interface for Props
interface Propstype {
    view: "lists-view" | "analysis-view";
    setView: React.Dispatch<React.SetStateAction<"lists-view" | "analysis-view">>;
}

// Analysis Component
function Analysis({ view, setView }: Propstype) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Attendence states
    const [attendances, setAttendences] = useState<IAttendence[] | []>([]);
    const [selectedAttendence, setSelectedAttendence] =
        useState<IAttendence | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);

    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Search batch
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    // search student
    const [selectedStudent, setSelectedStudent] = useState<string | "">("");
    const [students, setStudents] = useState<IStudent[] | []>([]);
    const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);

    // Filter status
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    // Sample data
    const studentRecords: StudentRecord[] = [
        {
            id: "1",
            date: "2025-04-22",
            batch: "Morning Batch",
            student: "John Doe",
            checkIn: "08:30 AM",
            checkOut: "04:30 PM",
            status: "present",
        },
        {
            id: "2",
            date: "2025-04-22",
            batch: "Afternoon Batch",
            student: "Jane Smith",
            checkIn: "01:15 PM",
            checkOut: "07:30 PM",
            status: "late",
        },
        {
            id: "3",
            date: "2025-04-22",
            batch: "Evening Batch",
            student: "Mike Johnson",
            checkIn: "05:00 PM",
            checkOut: "09:00 PM",
            status: "present",
        },
        {
            id: "4",
            date: "2025-04-21",
            batch: "Morning Batch",
            student: "Sarah Williams",
            checkIn: "--:--",
            checkOut: "--:--",
            status: "absent",
        },
        {
            id: "5",
            date: "2025-04-21",
            batch: "Afternoon Batch",
            student: "Alex Brown",
            checkIn: "01:30 PM",
            checkOut: "07:45 PM",
            status: "present",
        },
    ];

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const getStatusBadge = (
        status: "present" | "absent" | "late" | "pending"
    ) => {
        switch (status) {
            case "present":
                return (
                    <Badge className=" bg-green-400/20 hover:bg-green-400/30 text-green-600">
                        Present
                    </Badge>
                );
            case "absent":
                return (
                    <Badge className="bg-red-600/20 hover:bg-red-600/30 text-red-600">
                        Absent
                    </Badge>
                );
            case "late":
                return (
                    <Badge className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-600">
                        Late
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-600">
                        Pending
                    </Badge>
                );
        }
    };

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "date", order: -1 });

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" }); // e.g., "April"

    const [selectedYear, setSelectedYear] = useState(currentYear); // Number
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); // String

    return (
        <div className="p-5 pt-0 grid grid-cols-1">
            <div
                className="sticky top-0 bg-background dark:bg-sidebar-background w-full p-5 flex flex-col gap-5
        h-[calc(100vh-108px)] mb-5 md:mb-0 rounded-2xl
        border border-border shadow-sm overflow-hidden "
            >
                <CardHeader count={studentRecords.length} heading="Monthly Analysis" />

                <div className="flex items-center gap-2">
                    {/* Select Year */}
                    <SelectYear
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                    />

                    {/* Select month */}
                    <SelectMonth
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />

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

                {/* Table Header */}
                <div className="hidden grid-cols-12 gap-4 py-3 px-4 bg-muted dark:bg-sidebar rounded-lg font-medium text-[14.5px] text-foreground md:grid">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Student</div>
                    <div className="col-span-2">Batch</div>
                    <div className="col-span-2">Check In</div>
                    <div className="col-span-2">Check Out</div>
                    <div className="col-span-1">Status</div>
                </div>

                {/* Table Rows */}
                <div className="h-full flex flex-col gap-2 text-[14.5px] font-medium text-foreground overflow-auto no-scrollbar">
                    {studentRecords.map((record) => (
                        <div key={record.id} className="rounded-lg border border-border">
                            {/* Mobile/Desktop Row */}
                            <div
                                className="grid grid-cols-12 gap-4 p-4 cursor-pointer"
                                onClick={() => toggleRow(record.id)}
                            >
                                {/* Mobile View - Condensed Information */}
                                <div className="col-span-12 md:hidden flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{record.student}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {record.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(record.status)}
                                        {expandedRow === record.id ? (
                                            <ChevronUp size={18} />
                                        ) : (
                                            <ChevronDown size={18} />
                                        )}
                                    </div>
                                </div>

                                {/* Desktop View - Full Row */}
                                <div className="col-span-2 hidden md:flex items-center">
                                    {record.date}
                                </div>
                                <div className="col-span-3 hidden md:flex items-center">
                                    {record.student}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    {record.batch}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    {record.checkIn}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    {record.checkOut}
                                </div>
                                <div className="col-span-1 hidden md:flex items-center justify-between">
                                    {getStatusBadge(record.status)}
                                    {expandedRow === record.id ? (
                                        <ChevronUp size={18} />
                                    ) : (
                                        <ChevronDown size={18} />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedRow === record.id && (
                                <div className="p-4 bg-muted/30 border-t border-border">
                                    {/* Mobile View - Additional Details */}
                                    <div className="grid grid-cols-2 gap-4 md:hidden">
                                        <div className="col-span-1">
                                            <p className="text-sm font-medium">Batch</p>
                                            <p>{record.batch}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-sm font-medium">Check In</p>
                                            <p>{record.checkIn}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-sm font-medium">Check Out</p>
                                            <p>{record.checkOut}</p>
                                        </div>
                                    </div>

                                    {/* Common Expanded Content for Both Views */}
                                    <div className="mt-4 flex flex-col gap-3">
                                        <div className="flex flex-col">
                                            <h4 className="text-sm font-medium">Attendance Notes</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {record.status === "absent"
                                                    ? "Student did not attend class today."
                                                    : record.status === "late"
                                                        ? "Student arrived 15 minutes after class started."
                                                        : "Student attended the full session."}
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2"
                                            >
                                                <AlertCircle size={16} />
                                                Send Warning
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Analysis;
