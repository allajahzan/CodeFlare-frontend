import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ChangeEvent } from "react";

// Interface for Props
interface PropsType {
    id?: string;
    search: string;
    handleSearch: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

// Search Component
function Search({ id, search, handleSearch }: PropsType) {
    return (
        <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                id={id}
                type="text"
                placeholder="Search"
                autoComplete="off"
                required
                value={search}
                onChange={handleSearch}
                className="p-5 pl-9 pr-3 text-foreground font-medium rounded-lg shadow-sm bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
            />
        </div>
    );
}

export default Search;
