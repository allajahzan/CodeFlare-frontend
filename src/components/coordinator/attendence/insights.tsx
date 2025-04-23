import type React from "react";
import { useEffect, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { IBatch } from "@/types/batch";
import { IStudent } from "@/types/student";
import SelectMonthYear from "@/components/common/select/month-year-selector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MontlyOverview from "./monthly-overview";
import FlaggedStudents from "./flagged-students";
import FilterOptions from "./filter-options";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { handleCustomError } from "@/utils/error";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Student data interface
interface StudentRecord {
    id: string;
    date: string;
    batch: string;
    student: string;
    checkIn: string;
    checkOut: string;
    status: "Pending" | "Present" | "Absent" | "Late";
}

// Interface for Props
interface Propstype {
    view: "lists-view" | "insights-view";
    setView: React.Dispatch<React.SetStateAction<"lists-view" | "insights-view">>;
}

// insights Component
function Insights({ view, setView }: Propstype) {
    // View
    const [insightView, setInsightView] = useState<
        "monthly-overview" | "flagged-students"
    >("monthly-overview");

    // Sample data
    const studentRecords: StudentRecord[] = [
        {
            id: "1",
            date: "2025-04-22",
            batch: "Batch 1",
            student: "John Doe",
            checkIn: "08:30 AM",
            checkOut: "04:30 PM",
            status: "Present",
        },
        {
            id: "2",
            date: "2025-04-22",
            batch: "Batch 1",
            student: "Jane Smith",
            checkIn: "01:15 PM",
            checkOut: "07:30 PM",
            status: "Late",
        },
        {
            id: "3",
            date: "2025-04-22",
            batch: "Batch 2",
            student: "Mike Johnson",
            checkIn: "05:00 PM",
            checkOut: "09:00 PM",
            status: "Present",
        },
        {
            id: "4",
            date: "2025-04-21",
            batch: "Batch 2",
            student: "Sarah Williams",
            checkIn: "--:--",
            checkOut: "--:--",
            status: "Absent",
        },
        {
            id: "5",
            date: "2025-04-21",
            batch: "Batch 3",
            student: "Alex Brown",
            checkIn: "01:30 PM",
            checkOut: "07:45 PM",
            status: "Present",
        },
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });

    // Year and month
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Select batch
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    // Select student
    const [selectedStudent, setSelectedStudent] = useState<string | "">("");
    const [students, setStudents] = useState<IStudent[] | []>([]);
    const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);

    // Filter status
    const [selectedStatus, setSelectedStatus] = useState<string>("All");

    // Filter category
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Fetch students based on batch
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Clear states
                setFetchingStudents(true);
                setStudents([]);
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?category=student&batchId=${selectedBatch?._id}`,
                    role
                );

                if (resp?.status === 200) {
                    // Update students list
                    setStudents(resp.data.data);
                }
            } catch (err) {
                handleCustomError(err);
            } finally {
                setFetchingStudents(false);
            }
        };

        if (selectedBatch) fetchUsers();
    }, [selectedBatch]);

    return (
        <div className="p-5 pt-0 grid grid-cols-1">
            <div
                className="sticky top-0 bg-background dark:bg-sidebar-background w-full p-5 flex flex-col gap-5
        h-[calc(100vh-108px)] mb-5 md:mb-0 rounded-2xl
        border border-border shadow-sm overflow-hidden "
            >
                {/* Header - select insight view */}
                <div className="w-full flex items-center justify-between">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-fit border-none text-lg text-foreground font-semibold p-0 focus:outline-none flex items-center gap-2">
                            <span>Monthly overview (5)</span>
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setInsightView("monthly-overview")}
                            >
                                Monthly overview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setInsightView("flagged-students")}
                            >
                                Flagged students
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="bg-muted text-foreground rounded-full p-2">
                        <Download className="h-4 w-4" />
                    </div>
                </div>

                {/* Search filter */}
                <div className="flex items-center gap-2">
                    {/* Select year-month */}
                    <SelectMonthYear
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                    />

                    {/* Filter options */}
                    <FilterOptions
                        view={view}
                        setView={setView}
                        insightView={insightView}
                        selectedBatch={selectedBatch}
                        setSelectedBatch={setSelectedBatch}
                        selectedStudent={selectedStudent}
                        setSelectedStudent={setSelectedStudent}
                        setStudents={setStudents}
                        students={students}
                        fetchingStudents={fetchingStudents}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>

                {/* Toggle pages */}
                {insightView === "monthly-overview" ? (
                    <MontlyOverview studentRecords={studentRecords} />
                ) : (
                    <FlaggedStudents />
                )}
            </div>
        </div>
    );
}

export default Insights;
