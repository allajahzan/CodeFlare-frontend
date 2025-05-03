import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Premium Calender Card Components
function PremiumCalendarCard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Generate dates for the current month view
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateDates = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const dates = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            dates.push(date);
        }

        return dates;
    };

    const dates = generateDates();

    // Format month and year
    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    // Scroll to today's date when month changes
    useEffect(() => {
        const today = new Date();
        if (
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear() &&
            scrollContainerRef.current
        ) {
            const todayElement = scrollContainerRef.current.querySelector(
                '[data-today="true"]'
            );
            if (todayElement) {
                setTimeout(() => {
                    todayElement.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                    });
                }, 100);
            }
        }
    }, [currentDate]);

    // Get day name
    const getDayName = (date: Date) => {
        return date.toLocaleDateString("en-US", { weekday: "short" });
    };

    return (
        <div className="w-full flex flex-col">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-foreground">
                    {formatMonthYear(currentDate)}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-full hover:bg-muted"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-4 w-4 text-foreground" />
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-full hover:bg-muted"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-4 w-4 text-foreground" />
                    </button>
                </div>
            </div>

            {/* Scrollable dates */}
            <div ref={scrollContainerRef} className="flex overflow-x-auto pb-5">
                <div className="flex space-x-4 min-w-max px-1">
                    {dates.map((date, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            key={date.toString()}
                            className="flex flex-col items-center"
                            data-today={isToday(date) ? "true" : "false"}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 rounded-full mb-2 text-lg font-medium shadow",
                                    isToday(date)
                                        ? "bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 dark:bg-background border border-zinc-700 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                )}
                            >
                                {date.getDate()}
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">
                                {getDayName(date)}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PremiumCalendarCard;
