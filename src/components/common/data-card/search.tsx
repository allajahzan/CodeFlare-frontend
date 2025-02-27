import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

// Interface for Props
interface PropsType {
    search: string;
    handleSearch: () => void;
}

// Search Component
function Search({ search, handleSearch }: PropsType) {
    return (
        <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
    );
}

export default Search;
