import type React from "react";
import { useContext, useEffect, useRef, useState } from "react";
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
import AttendenceDefaulters, { IDefaulters } from "./attendence-defaulters";
import FilterOptions from "./filter-options";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { handleCustomError } from "@/utils/error";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { IAttendence } from "@/types/attendence";
import { IUserContext, UserContext } from "@/context/user-context";

// Interface for Props
interface Propstype {
    view: "lists-view" | "insights-view";
    setView: React.Dispatch<React.SetStateAction<"lists-view" | "insights-view">>;
}

// insights Component
function Insights({ view, setView }: Propstype) {
    // View
    const [insightView, setInsightView] = useState<
        "monthly-overview" | "attendence-defaulters"
    >("monthly-overview");

    // Attendence states
    const [attendences, setAttendences] = useState<IAttendence[] | []>([]);
    const [defaulters, setDefaulters] = useState<IDefaulters[] | []>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const [scrollFetching, setScrollFetching] = useState<boolean>(false);

    // Current date month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });

    // Year and month
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

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

    // Scroling div
    const divRef = useRef<HTMLDivElement>(null);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Handle infinite scroll
    const handleInfiniteScroll = async () => {
        try {
            if (divRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = divRef.current;

                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    if (scrollFetching) return;

                    setScrollFetching(true);

                    // Disable scrolling
                    divRef.current.style.overflow = "hidden";

                    if (insightView === "monthly-overview") {
                        // Send request
                        const resp = await fetchData(
                            ApiEndpoints.MONTHLY_ATTENDENCE +
                            `?type=${insightView}&batchIds=${selectedBatch
                                ? selectedBatch._id
                                : user?.batches?.map((batch) => batch._id).join(",")
                            }&userId=${selectedStudent}&month=${selectedMonth}&year=${selectedYear}&filter=${selectedStatus === "All" ? "" : selectedStatus
                            }&skip=${attendences.length}&limit=10`,
                            role
                        );

                        // Success response
                        if (resp && resp.status === 200) {
                            const data = resp.data?.data;

                            // Update attendence
                            setAttendences((prev: IAttendence[]) => {
                                return [...prev, ...data];
                            });

                            // Enable scrolling
                            divRef.current.style.overflow = "auto";
                            setScrollFetching(false);
                        }
                    } else {
                        // Send request
                        const resp = await fetchData(
                            ApiEndpoints.MONTHLY_ATTENDENCE +
                            `?type=${insightView}&batchIds=${selectedBatch
                                ? selectedBatch._id
                                : user?.batches?.map((batch) => batch._id).join(",")
                            }&userId=${selectedStudent}&month=${selectedMonth}&year=${selectedYear}&filter=${selectedCategory === "All" ? "" : selectedCategory
                            }&skip=${defaulters.length}&limit=10`,
                            role
                        );

                        // Success response
                        if (resp && resp.status === 200) {
                            const data = resp.data?.data;

                            // Update defaulters
                            setDefaulters((prev: IDefaulters[]) => {
                                return [...prev, ...data];
                            });

                            // Enable scrolling
                            divRef.current.style.overflow = "auto";
                            setScrollFetching(false);
                        }
                    }
                }
            }
        } catch (err: unknown) {
            // Enable scrolling
            if (divRef.current) {
                divRef.current.style.overflow = "auto";
            }
            handleCustomError(err);
        }
    };

    // Fetch defaulters
    useEffect(() => {
        const fetchDefaulters = async () => {
            try {
                setFetching(true);
                setDefaulters([]);
                setAttendences([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.MONTHLY_ATTENDENCE +
                    `?type=${insightView}&batchIds=${selectedBatch
                        ? selectedBatch._id
                        : user?.batches?.map((batch) => batch._id).join(",")
                    }&userId=${selectedStudent}&month=${selectedMonth}&year=${selectedYear}&filter=${selectedCategory === "All" ? "" : selectedCategory
                    }&skip=${defaulters.length}&limit=10`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update attendence
                    setTimeout(() => {
                        setDefaulters(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        insightView === "attendence-defaulters" && fetchDefaulters();
    }, [
        selectedMonth,
        selectedYear,
        selectedBatch,
        selectedStudent,
        selectedCategory,
        insightView,
    ]);

    // Fetch attendences - monthly overview
    useEffect(() => {
        const fetchAttendence = async () => {
            try {
                setFetching(true);
                setAttendences([]);
                setDefaulters([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.MONTHLY_ATTENDENCE +
                    `?type=${insightView}&batchIds=${selectedBatch
                        ? selectedBatch._id
                        : user?.batches?.map((batch) => batch._id).join(",")
                    }&userId=${selectedStudent}&month=${selectedMonth}&year=${selectedYear}&filter=${selectedStatus === "All" ? "" : selectedStatus
                    }&skip=${attendences.length}&limit=10`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update attendence
                    setTimeout(() => {
                        setAttendences(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        insightView === "monthly-overview" && fetchAttendence();
    }, [
        selectedMonth,
        selectedYear,
        selectedBatch,
        selectedStudent,
        selectedStatus,
        insightView,
    ]);

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
        h-[calc(100vh-108px)] rounded-2xl
        border border-border shadow-sm overflow-hidden "
            >
                {/* Header - select insight view */}
                <div className="w-full flex items-center justify-between">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-fit border-none text-lg text-foreground font-semibold p-0 focus:outline-none flex items-center gap-2">
                            <span>
                                {insightView === "monthly-overview"
                                    ? "Monthly overview"
                                    : "Attendance defaulters"}
                                ({attendences.length || defaulters.length})
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onClick={() => setInsightView("monthly-overview")}
                            >
                                Monthly overview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setAttendences([]);
                                    setInsightView("attendence-defaulters");
                                }}
                            >
                                Attendance defaulters
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

                {/* Toggle views */}
                {insightView === "monthly-overview" ? (
                    <MontlyOverview
                        attendences={attendences}
                        fetching={fetching}
                        divRef={divRef}
                        handleInfiniteScroll={handleInfiniteScroll}
                    />
                ) : (
                    <AttendenceDefaulters
                        defaulters={defaulters}
                        fetching={fetching}
                        month={selectedMonth}
                        year={selectedYear}
                        divRef={divRef}
                        handleInfiniteScroll={handleInfiniteScroll}
                    />
                )}
            </div>
        </div>
    );
}

export default Insights;
