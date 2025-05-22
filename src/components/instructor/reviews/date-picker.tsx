import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    className: string;
}

// Date picker Component
function DatePicker({ selectedDate, setSelectedDate, className }: PropsType) {
    return (
        <div
            onClick={(event) => event.stopPropagation()}
            className={cn("shadow", className)}
        >
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-none text-foreground"
            />
        </div>
    );
}

export default DatePicker;
