import {
    CalendarClockIcon,
    CalendarDaysIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    ScanEye,
} from "lucide-react";
import IconButton from "../ui/icon-button";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import DatePicker from "../instructor/reviews/date-picker";
import { Fragment, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import FilterAttendence from "./filter";
import { SelectValue } from "@radix-ui/react-select";

// Interface for Props
interface Propstype {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;
}

// Calendeer header Component
export function CalendarHeader({
    currentDate,
    onPreviousMonth,
    onNextMonth,
    view,
    setView,
}: Propstype) {
    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    // Redux
    const role = useSelector((state: stateType) => state.role);

    return (
        <div
            className={`flex items-center justify-between ${role === "coordinator" ? "p-5 py-3" : "p-5"
                } sticky top-0 z-30 border-b`}
        >
            <div
                className={`${view === "table-view" ? "hidden" : "flex"
                    } sm:flex items-center gap-2 truncate`}
            >
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
            <div
                className={`${view === "table-view" && "w-full"} sm:w-fit flex gap-1`}
            >
                {view === "calender-view" && (
                    <Fragment>
                        <IconButton
                            Icon={ChevronLeft}
                            action={onPreviousMonth}
                            className="bg-background dark:border-customBorder-dark dark:hover:bg-muted shadow-none dark:shadow-none"
                        />
                        <IconButton
                            Icon={ChevronRight}
                            action={onNextMonth}
                            className="bg-background dark:border-customBorder-dark dark:hover:bg-muted shadow-none dark:shadow-none"
                        />
                    </Fragment>
                )}

                {/* Select Date */}
                {view === "table-view" && (
                    <div className="relative w-full sm:col-span-2 lg:col-span-1">
                        <Select
                            value={
                                selectedDate
                                    ? new Date(selectedDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : ""
                            }
                        >
                            <SelectTrigger
                                title="Date"
                                className="w-full sm:w-[252px] text-foreground font-medium p-5 pl-9 cursor-pointer dark:border-customBorder-dark bg-background"
                            >
                                <SelectValue placeholder="Select date" className="truncate">
                                    {selectedDate
                                        ? new Date(selectedDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "Select date"}
                                </SelectValue>
                                <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                            </SelectTrigger>
                            <SelectContent
                                className="bg-transparent border-none shadow-none p-0 relative left-1"
                                align="end"
                            >
                                <DatePicker
                                    isDatePickerOpen={true}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    className="bg-background rounded-lg shadow-lg border dark:border-customBorder-dark"
                                />
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Filter modal */}
                {role === "coordinator" && (
                    <Select>
                        <SelectTrigger
                            title="Filter"
                            className="w-[41.6px] h-[41.6px] bg-background dark:border-customBorder-dark hover:bg-muted shadow-none"
                        >
                            <Filter className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent className="w-[220px]" align="end">
                            <FilterAttendence />
                        </SelectContent>
                    </Select>
                )}

                {/* View selecter */}
                {role === "coordinator" && (
                    <Select
                        onValueChange={(value: "table-view" | "calender-view") =>
                            setView(value)
                        }
                    >
                        <SelectTrigger
                            title="View"
                            className="w-[41.6px] h-[41.6px] bg-background dark:border-customBorder-dark hover:bg-muted shadow-none"
                        >
                            <ScanEye className="w-4 h-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="table-view">Table</SelectItem>
                            <SelectItem value="calender-view">Calender</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}
