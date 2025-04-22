import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CalendarFold } from "lucide-react";

// Select month Component
function SelectMonth({
    selectedMonth,
    setSelectedMonth,
}: {
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
}) {
    // Months
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-[41.6px] bg-background border dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none">
                <span className="pl-3 text-sm text-start text-foreground font-medium flex items-center gap-2">
                    <CalendarFold className="w-4 h-4 text-foreground" />{" "}
                    {selectedMonth || "Month"}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-[210px] overflow-auto">
                {months.map((month) => (
                    <DropdownMenuItem key={month} onClick={() => setSelectedMonth(month)}>
                        {month}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SelectMonth;
