import { Input } from "@/components/ui/input";
import { Search, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { ChangeEvent } from "react";

// Interface for Props
interface PropsType {
    search: string;
    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    status: boolean;
    hanldeStatus: () => void;
    children1?: React.ReactNode;
    children2?: React.ReactNode;
}

// SearchFilterSort Component
function SearchFilterSort({
    search,
    status,
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
                <button
                    onClick={hanldeStatus}
                    className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                >
                    {status ? (
                        <UserRoundMinus className="h-4 w-4 text-foreground" />
                    ) : (
                        <UserRoundCheck className="h-4 w-4 text-foreground" />
                    )}
                </button>
                {children1}
                {children2}
            </div>
        </div>
    );
}

export default SearchFilterSort;
