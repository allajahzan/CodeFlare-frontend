import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    isOpen: boolean;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DatePickerDemo({
    isOpen,
    selectedDate,
    setSelectedDate,
}: PropsType) {
    return (
        <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
                "absolute z-20 -top-[300px] -left-0.5 bg-background",
                isOpen ? "block" : "hidden"
            )}
        >
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow"
            />
        </div>
    );
}
