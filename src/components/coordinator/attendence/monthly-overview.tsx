import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    CalendarClock,
    CalendarCogIcon,
    ChevronDown,
    ChevronUp,
    Search,
} from "lucide-react";
import { Fragment, useState } from "react";
import profile from "@/assets/images/no-profile.svg";
import { IAttendence } from "@/types/IAttendence";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { motion } from "framer-motion";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";

// Interface for Props
interface Propstype {
    attendences: IAttendence[] | [];
    fetching: boolean;
    divRef: React.RefObject<HTMLDivElement>;
    handleInfiniteScroll: () => Promise<void>;
}

// Monthly overview Component
function MontlyOverview({
    attendences,
    fetching,
    divRef,
    handleInfiniteScroll,
}: Propstype) {
    // Toggle state
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Toggle row
    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="flex flex-col h-full gap-2 overflow-hidden">
            {/* Table */}
            {attendences.length > 0 && (
                <Fragment>
                    {/* Table header */}
                    <div className="hidden grid-cols-12 xl:gap-4 p-4 py-3 bg-muted dark:bg-sidebar-backgroundDark rounded-lg font-medium text-[14.5px] text-foreground md:grid">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-3">Student</div>
                        <div className="col-span-2">Batch</div>
                        <div className="col-span-2">Check-in</div>
                        <div className="col-span-2">Check-out</div>
                        <div className="col-span-1">Status</div>
                    </div>

                    {/* Table Rows */}
                    <div
                        onScroll={handleInfiniteScroll}
                        ref={divRef}
                        className="h-full flex flex-col gap-2 text-[14.5px] font-medium text-foreground overflow-auto no-scrollbar"
                    >
                        {attendences.map((attendence, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index % 10) * 0.1 }}
                                className="rounded-lg border border-border dark:border-transparent dark:bg-sidebar 
                                hover:bg-muted/60 dark:hover:bg-sidebar-backgroundDark shadow-sm"
                            >
                                {/* Mobile/Desktop Row */}
                                <div
                                    className="grid grid-cols-12 xl:gap-4 p-4 py-2 cursor-pointer"
                                    onClick={() => toggleRow(attendence._id)}
                                >
                                    {/* Mobile view */}
                                    <div className="col-span-12 md:hidden flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {attendence.user.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(attendence.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={cn(
                                                    "text-sm font-semibold rounded-full duration-0",
                                                    attendence.status === "Present"
                                                        ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                                        : attendence.status === "Absent"
                                                            ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                            : attendence.status === "Late"
                                                                ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                                                : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                                )}
                                            >
                                                {attendence.status}
                                            </Badge>
                                            {expandedRow === attendence._id ? (
                                                <ChevronUp className="w-4 h-5 text-foreground" />
                                            ) : (
                                                <ChevronDown className="w-4 h-5 text-foreground" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Lap view */}
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {new Date(attendence.date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div className="col-span-3 hidden md:flex items-center gap-2">
                                        <Avatar className="bg-background w-10 h-10 border-2 border-background dark:border-border shadow-md">
                                            <AvatarImage
                                                src={attendence.user.profilePic}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-transparent">
                                                <img src={profile} alt="" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span> {attendence.user.name}</span>
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {attendence.batch.name}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {attendence.checkIn
                                            ? convertTo12HourFormat(attendence.checkIn)
                                            : "--:--"}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {attendence.checkOut
                                            ? convertTo12HourFormat(attendence.checkOut)
                                            : "--:--"}
                                    </div>
                                    <div className="col-span-1 hidden md:flex items-center justify-between">
                                        <Badge
                                            className={cn(
                                                "text-sm font-semibold rounded-full duration-0",
                                                attendence.status === "Present"
                                                    ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                                    : attendence.status === "Absent"
                                                        ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                        : attendence.status === "Late"
                                                            ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                                            : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                            )}
                                        >
                                            {attendence.status}
                                        </Badge>
                                        {expandedRow === attendence._id ? (
                                            <ChevronUp className="w-4 h-4 shrink-0 hidden lg:block" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 shrink-0 hidden lg:block" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedRow === attendence._id && (
                                    <div className="p-4 border-t border-border">
                                        {/* For Mobile view only */}
                                        <div className="grid grid-cols-2 gap-4 md:hidden">
                                            <div className="col-span-2">
                                                <p className="text-sm text-muted-foreground font-semibold">
                                                    Batch
                                                </p>
                                                <p>{attendence.batch.name}</p>
                                            </div>
                                            <div className="col-span-1">
                                                <p className="text-sm text-muted-foreground font-semibold">
                                                    Check In
                                                </p>
                                                <p>
                                                    {attendence.checkIn
                                                        ? convertTo12HourFormat(attendence.checkIn)
                                                        : "--:--"}
                                                </p>
                                            </div>
                                            <div className="col-span-1">
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    Check Out
                                                </p>
                                                <p>
                                                    {attendence.checkOut
                                                        ? convertTo12HourFormat(attendence.checkOut)
                                                        : "--:--"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Common for both views */}
                                        <div className="flex items-center justify-between gap-3 mt-4">
                                            <div className="flex flex-col">
                                                <h4 className="text-sm text-muted-foreground font-medium">
                                                    Reason
                                                </h4>
                                                <p className="text-sm">
                                                    {attendence.reason.description
                                                        ? attendence.reason.description
                                                        : "NILL"}
                                                </p>
                                            </div>

                                            {/* <div className="hidden">
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
                                            </div> */}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </Fragment>
            )}

            {/* If no attendences */}
            {attendences.length === 0 && (
                <NotFoundOrbit
                    MainIcon={CalendarClock}
                    SubIcon={fetching ? Search : CalendarCogIcon}
                    message={
                        fetching
                            ? "Please wait a moment"
                            : "No attendance lists available yet"
                    }
                    text={fetching ? "Fetching..." : "No attendance found"}
                    className="w-full h-full"
                />
            )}
        </div>
    );
}

export default MontlyOverview;
