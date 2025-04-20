import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    // isSameDay,
    isToday,
} from "date-fns";
import { motion } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";

interface Propstype {
    attendanceData: Record<string, any>;
    currentDate: Date;
    onDateClick: (date: Date) => void;
}

function Calendar({ currentDate, onDateClick, attendanceData }: Propstype) {
    // First day of the month
    const monthStart = startOfMonth(currentDate);

    // Last day of the month
    const monthEnd = endOfMonth(currentDate);

    // First day of the first week of the month
    // Days from the previous month to fill the first week
    const calendarStart = startOfWeek(monthStart);

    // Last day of the last week of the month
    // Days from the next month to fill the last week
    const calendarEnd = endOfWeek(monthEnd);

    // All days in the calendar view (including days from prev/next months)
    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    // Create weeks array for the grid
    const weeks: any[] = [];
    let week: any[] = [];

    calendarDays.forEach((day, i) => {
        week.push(day);
        if (i % 7 === 6) {
            weeks.push(week);
            week = [];
        }
    });

    // Get attendence data
    const getAttendanceStatus = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return attendanceData[dateStr];
    };

    return (
        <div className="h-[calc(100vh-195px)] bg-background dark:bg-sidebar-background">
            <div className="h-full flex flex-col flex-1 p-5 rounded-2xl border shadow-sm overflow-auto no-scrollbar">
                {/* Week day headers */}
                <div className="grid grid-cols-7 gap-px mb-2 text-center text-[14.5px] font-semibold text-foreground">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="pb-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid (Takes full height) */}
                <div className="flex-1 grid grid-rows-6 grid-cols-7 gap-2">
                    {weeks.map((week, index) =>
                        week.map((day: any, i: number) => {
                            const attendance = getAttendanceStatus(day);
                            const isCurrentMonth = isSameMonth(day, currentDate);

                            // Tailwind class according to the conditions
                            const backgroundClass = attendance?.status
                                ? attendance.status === "present"
                                    ? isToday(day)
                                        ? ""
                                        : "cursor-pointer bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800"
                                    : attendance.status === "absent"
                                        ? "cursor-pointer bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800"
                                        : attendance.status === "late"
                                            ? "cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800"
                                            : "cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800"
                                : isCurrentMonth
                                    ? `bg-background dark:bg-sidebar-backgroundDark hover:bg-muted hover:dark:bg-muted`
                                    : "bg-muted dark:bg-sidebar-background";

                            const textColor = !isCurrentMonth
                                ? "text-zinc-300 dark:text-zinc-800"
                                : "text-foreground";

                            // Final class
                            const finalClass = `${backgroundClass}  ${textColor}`;

                            return (
                                <TooltipProvider key={day.toString()}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                                className={`
                                        relative flex flex-col  
                                        border border-border dark:border-customBorder rounded-lg p-2 ${finalClass}`}
                                                onClick={() => i !== 0 && onDateClick(day)}
                                            >
                                                {/* Date */}
                                                <time
                                                    dateTime={format(day, "yyyy-MM-dd")}
                                                    className={`mb-1 text-center text-sm sm:text-base font-bold
                                            ${attendance?.status === "absent"
                                                            ? "text-red-600"
                                                            : attendance?.status ===
                                                                "present"
                                                                ? "text-green-600"
                                                                : attendance?.status === "late"
                                                                    ? "text-blue-600"
                                                                    : attendance?.status ===
                                                                        "pending"
                                                                        ? "text-yellow-600"
                                                                        : ""
                                                        }
                                            ${isToday(day)
                                                            ? "font-bold text-yellow-600"
                                                            : ""
                                                        }
                                        `}
                                                >
                                                    {format(day, "d")}
                                                </time>

                                                {/* Attendence status */}
                                                {attendance && (
                                                    // <Badge className="text-xs capitalize">
                                                    //     {attendance.status}
                                                    // </Badge>
                                                    <div className={`absolute z-10 inset-0 rounded-lg `}>
                                                        <p
                                                            className={`absolute -translate-x-1/2 top-[55%] left-1/2 font-medium`}
                                                        >
                                                            {attendance.status === "present" ? (
                                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                            ) : attendance.status === "absent" ? (
                                                                <XCircle className="w-5 h-5 text-red-600" />
                                                            ) : (
                                                                <CircleDashed className="w-5 h-5 text-yellow-600" />
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* For sundays */}
                                                <p className="text-center text-muted-foreground font-medium tracking-wide truncate">
                                                    {i == 0 ? "Holiday" : ""}
                                                </p>
                                            </motion.div>
                                        </TooltipTrigger>
                                        {/* Tooltip content */}
                                        {attendance && (
                                            <TooltipContent className="bg-background text-foreground dark:bg-sidebar border borer-2">
                                                <p className="capitalize">{attendance.status}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {attendance.notes}
                                                </p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
