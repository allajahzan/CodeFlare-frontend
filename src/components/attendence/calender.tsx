import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
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

// Inteface for event
export interface IEvent {
    date: Date;
    title: string;
    description: string;
    start: Date;
    end: Date;
    breaks: {
        start: string;
        end: string;
        reason: string;
    }[];
    status: string;
    location: string;
}

interface Propstype {
    attendanceData: Record<string, any>;
    currentDate: Date;
    onDateClick: (date: Date) => void;
}

function Calendar({ currentDate, onDateClick, attendanceData }: Propstype) {
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    // Get the first day of the month
    const monthStart = startOfMonth(currentDate);

    // Get the last day of the month
    const monthEnd = endOfMonth(currentDate);

    // Get the first day of the first week of the month
    // This ensures we include days from the previous month to fill the first week
    const calendarStart = startOfWeek(monthStart);

    // Get the last day of the last week of the month
    // This ensures we include days from the next month to fill the last week
    const calendarEnd = endOfWeek(monthEnd);

    // Get all days in the calendar view (including days from prev/next months)
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

    // const getStatusColor = (status: string) => {
    //   switch (status) {
    //     case "present":
    //       return "success";
    //     case "absent":
    //       return "destructive";
    //     case "late":
    //       return "warning";
    //     default:
    //       return "default";
    //   }
    // };
    return (
        <div className="h-full flex flex-col flex-1 p-5 overflow-hidden">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-px mb-2 text-center text-[14.5px] font-semibold text-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="pb-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid (Takes full height) */}
            <div className="flex-1 grid grid-rows-6 grid-cols-7 gap-1">
                {weeks.map((week, index) =>
                    week.map((day: any, i: number) => {
                        const attendance = getAttendanceStatus(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

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
                                            border rounded-lg p-2 hover:bg-muted dark:hover:bg-sidebar
                                            ${isCurrentMonth
                                                    ? "bg-background"
                                                    : "bg-muted dark:bg-sidebar"
                                                } 
                                            ${isToday(day)
                                                    ? "bg-blue-600/10 hover:bg-blue-600/20"
                                                    : ""
                                                } 
                                            ${isSameDay(day, hoveredDate)
                                                    ? "bg-muted"
                                                    : ""
                                                }
                                            ${!isCurrentMonth
                                                    ? "text-muted-foreground"
                                                    : "text-foreground"
                                                }
                                        `}
                                            onClick={() => i !== 0 && onDateClick(day)}
                                            onMouseEnter={() => setHoveredDate(day)}
                                            onMouseLeave={() => setHoveredDate(null)}
                                        >
                                            <time
                                                dateTime={format(day, "yyyy-MM-dd")}
                                                className={`mb-1 text-center text-base 
                                                ${attendance?.status ===
                                                        "absent"
                                                        ? "text-red-600"
                                                        : attendance?.status ===
                                                            "present"
                                                            ? "text-green-600"
                                                            : isToday(day)
                                                                ? "text-yellow-600"
                                                                : ""
                                                    } 
                                                    }
                                                ${isToday(day)
                                                        ? "font-bold"
                                                        : ""
                                                    }
                                            `}
                                            >
                                                {format(day, "d")}
                                            </time>

                                            {attendance && (
                                                // <Badge className="text-xs capitalize">
                                                //     {attendance.status}
                                                // </Badge>
                                                <div className={`absolute z-10 inset-0 rounded-lg ${attendance?.status === "present"
                                                            ? isToday(day)
                                                                ? ""
                                                                : "bg-green-600/10 "
                                                            : attendance?.status === "absent"
                                                                ? "bg-red-600/10 "
                                                                : ""
                                                        }`}>
                                                    <p
                                                        className={`absolute -translate-x-1/2 top-1/2 left-1/2 font-medium`}
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
                                            <p className="text-center text-sm opacity-50 text-foreground font-medium tracking-wide">
                                                {i == 0 ? "Holiday" : ""}
                                            </p>
                                        </motion.div>
                                    </TooltipTrigger>
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
    );
}

export default Calendar;
