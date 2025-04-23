import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import profile from "@/assets/images/no-profile.svg";

// Interface for Props
interface Propstype {
    studentRecords: any;
}

// Monthly overview Component
function MontlyOverview({ studentRecords }: Propstype) {
    // Toggle state
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Toggle row
    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-12 xl:gap-4 py-3 px-4 bg-muted dark:bg-sidebar-backgroundDark border dark:border-transparent  rounded-lg font-medium text-[14.5px] text-foreground md:grid">
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Student</div>
                <div className="col-span-2">Batch</div>
                <div className="col-span-2">Check-in</div>
                <div className="col-span-2">Check-out</div>
                <div className="col-span-1">Status</div>
            </div>

            {/* Table Rows */}
            <div className="h-full flex flex-col gap-2 text-[14.5px] font-medium text-foreground overflow-auto no-scrollbar">
                {studentRecords.map((record: any) => (
                    <div
                        key={record.id}
                        className="rounded-lg border border-border dark:border-transparent dark:bg-sidebar"
                    >
                        {/* Mobile/Desktop Row */}
                        <div
                            className="grid grid-cols-12 xl:gap-4 p-4 py-2 cursor-pointer"
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
                                    <Badge
                                        className={cn(
                                            "text-sm font-semibold rounded-full duration-0",
                                            record.status === "Present"
                                                ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                                : record.status === "Absent"
                                                    ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                    : record.status === "Late"
                                                        ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                                        : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                        )}
                                    >
                                        {record.status}
                                    </Badge>
                                    {expandedRow === record.id ? (
                                        <ChevronUp className="w-4 h-5 text-foreground" />
                                    ) : (
                                        <ChevronDown className="w-4 h-5 text-foreground" />
                                    )}
                                </div>
                            </div>

                            {/* Desktop View - Full Row */}
                            <div className="col-span-2 hidden md:flex items-center">
                                {record.date}
                            </div>
                            <div className="col-span-3 hidden md:flex items-center gap-2">
                                <Avatar className="bg-background w-10 h-10 border border-background dark:border-border shadow-md">
                                    <AvatarImage src={""} className="object-cover" />
                                    <AvatarFallback className="bg-transparent">
                                        <img src={profile} alt="" />
                                    </AvatarFallback>
                                </Avatar>
                                <span> {record.student}</span>
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
                                <Badge
                                    className={cn(
                                        "text-sm font-semibold rounded-full duration-0",
                                        record.status === "Present"
                                            ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                            : record.status === "Absent"
                                                ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                : record.status === "Late"
                                                    ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                                    : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                    )}
                                >
                                    {record.status}
                                </Badge>
                                {expandedRow === record.id ? (
                                    <ChevronUp className="w-4 h-4 shrink-0 hidden lg:block" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 shrink-0 hidden lg:block" />
                                )}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedRow === record.id && (
                            <div className="p-4 border-t border-border dark:border-customBorder">
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
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-medium">Reason</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {record.status === "absent"
                                                ? "Student did not attend class today."
                                                : record.status === "late"
                                                    ? "Student arrived 15 minutes after class started."
                                                    : "Student attended the full session."}
                                        </p>
                                    </div>

                                    <div className="hidden">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="duration-0 flex items-center gap-2 border-orange-200 dark:border-orange-800 bg-orange-600/20 hover:bg-orange-600/30 
                                                    text-orange-600 hover:text-orange-600 font-medium shadow-sm
                                                    "
                                        >
                                            <AlertTriangle size={16} />
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
    );
}

export default MontlyOverview;
