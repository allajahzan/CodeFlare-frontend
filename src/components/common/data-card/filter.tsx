import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, FilterIcon } from "lucide-react";

// Inteface for Props
interface PropsType {
    title: string;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    fitlerData: string[];
}

// Filter Component
function Filter({ title, fitlerData, filter, setFilter }: PropsType) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center justify-center w-[41.6px] rounded-lg
                border bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark shadow-sm"
            >
                <FilterIcon className="h-4 w-4 text-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
            >
                <DropdownMenuLabel>{title}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Sorting options */}
                {fitlerData.map((data, index) => {
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => setFilter(data)}
                            onSelect={(e) => e.preventDefault()}
                            className="flex justify-between"
                        >
                            <span>{data === "" ? "All" : data}</span>
                            {data === filter && <Check className="w-4 h-4 text-foreground" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Filter;
