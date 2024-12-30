import { Search, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { ChangeEvent } from "react";

interface PropsType {
    search: string;
    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    status: boolean;
    hanldeStatus: () => void;
    children1: React.ReactNode;
    children2: React.ReactNode;
}

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
                    <input
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        className="w-full h-full px-4 py-2 pl-9 font-medium placeholder:text-muted-foreground border shadow-sm rounded-lg"
                    />
                </div>
                <button onClick={hanldeStatus} className="icon-style shadow-sm">
                    {status ? (
                        <UserRoundMinus className="h-4 w-4" />
                    ) : (
                        <UserRoundCheck className="h-4 w-4" />
                    )}
                </button>
                {children1}
                {children2}
            </div>
        </div>
    );
}

export default SearchFilterSort;
