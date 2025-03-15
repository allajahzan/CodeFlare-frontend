import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "../ui/icon-button";

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
  return (
    <div className=" flex items-center justify-between p-5 sticky top-0 z-30 border-b">
      {/* <h1 className="text-lg text-foreground font-semibold">Attendence Info</h1> */}
      <h1 className="text-base text-foreground font-semibold">
        {format(currentDate, "MMMM yyyy")}
      </h1>
      <div className="flex gap-1">
        <IconButton Icon={ChevronLeft} action={onPreviousMonth} />
        <IconButton Icon={ChevronRight} action={onNextMonth} />
      </div>
    </div>
  );
}
