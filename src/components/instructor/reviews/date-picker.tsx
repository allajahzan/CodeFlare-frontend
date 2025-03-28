import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    isDatePickerOpen: boolean;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    className: string;
}

// Date picker Component
function DatePicker({
    isDatePickerOpen,
    selectedDate,
    setSelectedDate,
    className
}: PropsType) {
    return (
        <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
                className,
                isDatePickerOpen ? "block" : "hidden"
            )}
        >
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-none shadow text-foreground"
            />
        </div>
    );
}

export default DatePicker;