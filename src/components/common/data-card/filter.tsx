import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";

// Inteface for Props
interface PropsType {
    title: string;
    fitlerData: string[];
}

// Filter Component
function Filter({ title, fitlerData }: PropsType) {
    return (
        <Select>
            <SelectTrigger
                className="w-[41.6px] h-[41.6px] flex justify-center p-0 py-5 
                                    hover:bg-muted dark:hover:bg-sidebar shadow-sm"
            >
                <FilterIcon className="h-4 w-4 text-foreground" />
            </SelectTrigger>
            <SelectContent align={"end"}>
                <SelectGroup>
                    <SelectLabel>{title}</SelectLabel>
                    {fitlerData.map((data, index) => {
                        return (
                            <SelectItem key={index} value={data.toLowerCase()}>
                                {data}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default Filter;
