import { ScanEye, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import SelectBatchStudent from "./filter-batch-student";
import { IStudent } from "@/types/student";
import { IBatch } from "@/types/batch";
import Filter from "@/components/common/data-card/filter";

// Interface for Props
interface Propstype {
    view: "lists-view" | "insights-view";
    setView: React.Dispatch<React.SetStateAction<"lists-view" | "insights-view">>;

    insightView?: "monthly-overview" | "monthly-defaulters";

    selectedBatch: IBatch | null;
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
    selectedStudent: string | "";
    setSelectedStudent: React.Dispatch<React.SetStateAction<string | "">>;

    students: [] | IStudent[];
    setStudents: React.Dispatch<React.SetStateAction<[] | IStudent[]>>;
    fetchingStudents: boolean;

    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string | "">>;

    selectedCategory?: string;
    setSelectedCategory?: React.Dispatch<React.SetStateAction<string | "">>;
}

// Filter options Component
function FilterOptions({
    view,
    setView,

    insightView, // Optional

    selectedBatch,
    setSelectedBatch,
    selectedStudent,
    setSelectedStudent,

    students,
    setStudents,
    fetchingStudents,

    selectedStatus,
    setSelectedStatus,

    selectedCategory, // Optional
    setSelectedCategory, // Optional
}: Propstype) {
    return (
        <div className="sticky top-0 z-30 rounded-b-xl will-change-transform">
            <div className="flex items-center justify-between p-0">
                {/* Buttons */}
                <div className="flex gap-2 w-full">
                    {/* Select batch and student */}
                    <Select>
                        <SelectTrigger
                            title="Search"
                            className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none"
                        >
                            <Search className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent className="w-[220px]" align="end">
                            <SelectBatchStudent
                                selectedBatch={selectedBatch}
                                setSelectedBatch={setSelectedBatch}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                students={students}
                                setStudents={setStudents}
                                fetchingStudents={fetchingStudents}
                            />
                        </SelectContent>
                    </Select>

                    {/* Filter daily records and monthly overview */}
                    {(!insightView || insightView === "monthly-overview") && (
                        <Filter
                            title="Status"
                            filter={selectedStatus}
                            setFilter={setSelectedStatus}
                            fitlerData={["All", "Pending", "Present", "Absent", "Late"]}
                        />
                    )}

                    {/* Filter for flagged students */}
                    {insightView && insightView === "monthly-defaulters" && (
                        <Filter
                            title="Status"
                            filter={selectedCategory as string}
                            setFilter={
                                setSelectedCategory as React.Dispatch<
                                    React.SetStateAction<string>
                                >
                            }
                            fitlerData={["All", "Absent", "Late"]}
                        />
                    )}

                    {/* View selecter */}
                    <Select
                        onValueChange={(value: "lists-view" | "insights-view") =>
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
                            <SelectItem value="lists-view">Daily Records</SelectItem>
                            <SelectItem value="insights-view">Insights</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

export default FilterOptions;
