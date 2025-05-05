import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "@/components/ui/icon-button";
import { Check, SortAsc } from "lucide-react";
import ToolTip from "../tooltip/tooltip";

// Interface for Props
interface PropsType {
    sort: {
        key: string;
        order: number;
    };
    setSort: React.Dispatch<
        React.SetStateAction<{
            key: string;
            order: number;
        }>
    >;
    sortData: string[];
}
// Sort Component
function Sort({ sort, setSort, sortData }: PropsType) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <ToolTip text="Sort" children={<IconButton Icon={SortAsc} />} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
            >
                <DropdownMenuLabel>Sort</DropdownMenuLabel>

                {/* Checkbox for sorting order */}
                <div className="flex items-center gap-2 py-1.5 pl-2 cursor-pointer">
                    <Checkbox
                        checked={sort.order === 1}
                        onCheckedChange={() => {
                            setSort((prev) => ({
                                ...prev,
                                order: prev.order === 1 ? -1 : 1,
                            }));
                        }}
                        id="ascending"
                        className="border-border"
                    />
                    <label
                        htmlFor="ascending"
                        className="text-sm font-medium cursor-pointer"
                    >
                        Ascending
                    </label>
                </div>

                <DropdownMenuSeparator />

                {/* Sorting options */}
                {sortData.map((data, index) => {
                    return (
                        <DropdownMenuItem
                            key={index}
                            textValue={data}
                            onClick={() =>
                                setSort((prev) =>
                                    prev.key !== data ? { key: data, order: prev.order } : prev
                                )
                            }
                            onSelect={(e) => e.preventDefault()}
                            className="flex justify-between"
                        >
                            <span>
                                {data === "createdAt"
                                    ? "Date"
                                    : data[0].toUpperCase() + data.slice(1)}
                            </span>
                            <span>
                                {sort.key === data && (
                                    <Check className="w-4 h-4 text-foreground" />
                                )}
                            </span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Sort;
