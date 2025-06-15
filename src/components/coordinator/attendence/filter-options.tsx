import { ScanEye, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import FilterBatchStudent from "./filter-batch-student";
import { IStudent } from "@/types/IStudent";
import Filter from "@/components/common/data-toolbar/filter";
import { IBatch } from "@codeflare/common";
import ToolTip from "@/components/common/tooltip/tooltip";

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
        <div className="flex gap-2">
            {/* Select batch and student */}
            <Select>
                <SelectTrigger className="relative w-[41px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none">
                    <ToolTip
                        text="Batch and student"
                        children={
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="w-4 h-4 text-foreground" />
                            </div>
                        }
                        className=""
                    />
                </SelectTrigger>
                <SelectContent className="w-[220px]" align="end">
                    <FilterBatchStudent
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
                    filterData={["All", "Pending", "Present", "Absent", "Late"]}
                />
            )}

            {/* Filter for flagged students */}
            {insightView && insightView === "monthly-defaulters" && (
                <Filter
                    title="Status"
                    filter={selectedCategory as string}
                    setFilter={
                        setSelectedCategory as React.Dispatch<React.SetStateAction<string>>
                    }
                    filterData={["All", "Absent", "Late"]}
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
    );
}

export default FilterOptions;
