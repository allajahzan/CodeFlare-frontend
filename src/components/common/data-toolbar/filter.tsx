import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "@/components/ui/icon-button";
import { Check, FilterIcon, LucideProps } from "lucide-react";
import ToolTip from "../tooltip/tooltip";

// Inteface for Props
interface PropsType {
    title: string;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    filterData: string[];
    Icon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
}

// Filter Component
function Filter({ title, filterData, filter, setFilter, Icon }: PropsType) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <ToolTip
                    text={title || "Filter"}
                    children={<IconButton Icon={Icon || FilterIcon} />}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
            >
                <DropdownMenuLabel>{title}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Sorting options */}
                {filterData.map((data, index) => {
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => setFilter(data)}
                            onSelect={(e) => e.preventDefault()}
                            className="flex justify-between"
                        >
                            <span>
                                {data === "" ? "All" : data[0].toUpperCase() + data.slice(1)}
                            </span>
                            {data === filter && <Check className="w-4 h-4 text-foreground" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Filter;
