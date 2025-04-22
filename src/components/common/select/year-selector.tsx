import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CalendarDays } from "lucide-react";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

// Select year Component
function SelectYear({
    selectedYear,
    setSelectedYear,
}: {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                defaultValue={selectedYear}
                className="w-full h-[41.6px] bg-background border dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar rounded-lg shadow-none"
            >
                <span className="pl-3 text-sm text-start text-foreground font-medium flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-foreground" />{" "}
                    {selectedYear || "Year"}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-[210px] overflow-auto ">
                {years.map((year) => (
                    <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                        {year}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SelectYear;
