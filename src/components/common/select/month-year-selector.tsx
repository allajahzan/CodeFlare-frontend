import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CalendarFold, Check } from "lucide-react";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
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

// Interface for Props
interface Propstype {
    selectedYear: number;
    setSelectedYear: (value: number) => void;
    selectedMonth: string;
    setSelectedMonth: (value: string) => void;
}

function SelectMonthYear({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
}: Propstype) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-[41.6px] bg-background border dark:hover:border-customBorder-dark dark:hover:bg-sidebar rounded-lg shadow-none">
                <span className="pl-3 text-[14.5px] text-start text-foreground font-medium flex items-center gap-2 truncate">
                    <CalendarFold className="w-4 h-4 text-foreground" />
                    {selectedMonth
                        .split("")
                        .filter((_, index) => index < 3)
                        .join("") || "Month"}{" "}
                    {selectedYear || "Year"}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-[200px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Year Section */}
                <div className="max-h-[170px] overflow-auto">
                    {years.map((year) => (
                        <DropdownMenuItem
                            key={year}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedYear(year);
                            }}
                        >
                            {year}
                            {selectedYear === year && (
                                <Check className="w-4 h-4 text-foreground ml-auto" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </div>

                <DropdownMenuSeparator />

                {/* Month Section */}
                <div className="max-h-[170px] overflow-auto">
                    {months.map((month) => (
                        <DropdownMenuItem
                            key={month}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedMonth(`${month}`);
                            }}
                        >
                            {month}
                            {selectedMonth === month && (
                                <Check className="w-4 h-4 text-foreground ml-auto" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SelectMonthYear;
