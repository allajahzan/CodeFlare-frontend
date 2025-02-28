import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    isOpen: boolean;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    className: string;
}

// Date picker Component
function DatePicker({
    isOpen,
    selectedDate,
    setSelectedDate,
    className
}: PropsType) {
    return (
        <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
                className,
                isOpen ? "block" : "hidden"
            )}
        >
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow text-foreground"
            />
        </div>
    );
}

export default DatePicker;