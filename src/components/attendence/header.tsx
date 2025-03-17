import { format } from "date-fns";
import { CalendarClockIcon, ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "../ui/icon-button";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Interface for Props
interface Propstype {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

// Calendeer header Component
export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: Propstype) {
  // Redux
  const role = useSelector((state: stateType) => state.role);

  return (
    <div
      className={`flex items-center justify-between ${role === "coordinator" ? "p-5 py-3" : "p-5"
        } sticky top-0 z-30 border-b`}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-muted"><CalendarClockIcon className="w-5 h-5 text-foreground" /></div>
        <h1 className="text-lg text-foreground font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h1>
      </div>
      <div className="flex gap-1">
        <IconButton
          Icon={ChevronLeft}
          action={onPreviousMonth}
          className="bg-background dark:hover:bg-muted dark:shadow-none"
        />
        <IconButton
          Icon={ChevronRight}
          action={onNextMonth}
          className="bg-background dark:hover:bg-muted dark:shadow-none"
        />
      </div>
      
    </div>
  );
}
