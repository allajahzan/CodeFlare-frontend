import { Input } from "@/components/ui/input";
import { Search, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { ChangeEvent } from "react";
import ToolTip from "../tooltip/tooltip";

// Interface for Props
interface PropsType {
    search?: string;
    handleSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    isBlocked?: boolean;
    hanldeStatus?: () => void;
    children1?: React.ReactNode;
    children2?: React.ReactNode;
}

// SearchFilterSort Component
function SearchFilterSort({
    search,
    isBlocked,
    handleSearch,
    hanldeStatus,
    children1,
    children2,
}: PropsType) {
    return (
        <div className="flex items-center w-full">
            {/* search , filter, sort */}
            <div className="w-full flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search"
                        autoComplete="off"
                        required
                        value={search}
                        onChange={handleSearch}
                        className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                    />
                </div>
                <ToolTip
                    action={hanldeStatus}
                    text={isBlocked ? "Blocked Users" : "Active Users"}
                    children={
                        <div
                            onClick={hanldeStatus}
                            className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                     shadow-sm dark:shadow-customBorder dark:shadow-inner"
                        >
                            {isBlocked ? (
                                <UserRoundMinus className="h-4 w-4 text-foreground" />
                            ) : (
                                <UserRoundCheck className="h-4 w-4 text-foreground" />
                            )}
                        </div>
                    }
                />
                {children1}
                {children2}
            </div>
        </div>
    );
}

export default SearchFilterSort;
