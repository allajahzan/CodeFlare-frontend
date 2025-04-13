import { CalendarClockIcon, ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import { Fragment } from "react";

// Interface for Props
interface Propstype {
    currentDate: Date;
    onPreviousMonth?: () => void;
    onNextMonth?: () => void;
}

// Calendeer header Component
function CalenderHeader({
    currentDate,
    onPreviousMonth,
    onNextMonth,
}: Propstype) {
    return (
        <div className="bg-background dark:bg-sidebar-background sticky top-0 z-30 rounded-b-xl">
            <div className="flex items-center justify-between w-full p-5 py-3 border shadow-sm rounded-xl">
                <div className={`flex items-center gap-2 truncate`}>
                    <div className="p-2 rounded-full bg-muted">
                        <CalendarClockIcon className="w-5 h-5 text-foreground" />
                    </div>

                    <h1 className="text-lg text-foreground font-semibold">
                        {new Date(currentDate).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "2-digit",
                        })}
                    </h1>
                </div>

                {/* Buttons */}
                <div className="flex gap-1">
                    <Fragment>
                        <IconButton
                            Icon={ChevronLeft}
                            action={onPreviousMonth}
                            className="bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none dark:shadow-none"
                        />
                        <IconButton
                            Icon={ChevronRight}
                            action={onNextMonth}
                            className="bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none dark:shadow-none"
                        />
                    </Fragment>
                </div>
            </div>
        </div>
    );
}

export default CalenderHeader;
