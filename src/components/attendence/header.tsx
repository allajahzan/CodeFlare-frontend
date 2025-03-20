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
            className={`bg-transparent sticky top-0 z-30 ${view === "calender-view" && "rounded-b-xl"
                }`}
        >
            <div
                className={`flex items-center justify-between ${view === "calender-view"
                        ? "w-full p-5 py-3 border shadow-sm rounded-xl "
                        : "p-0"
                    }`}
            >
                {view === "calender-view" && (
                    <div className={`flex items-center gap-2 truncate`}>
                        <div className="p-2 rounded-full bg-muted">
                            <CalendarClockIcon className="w-5 h-5 text-foreground" />
                        </div>

                        {/* {view === "calender-view" && ( */}
                        <h1 className="text-lg text-foreground font-semibold">
                            {new Date(currentDate).toLocaleDateString("en-GB", {
                                month: "short",
                                year: "2-digit",
                            })}
                        </h1>
                        {/* )} */}

                        {/* {view === "table-view" && (
                        <h1 className="text-lg text-foreground font-semibold">
                            {new Date(selectedDate as Date).toLocaleDateString("en-GB", {
                                month: "short",
                                year: "2-digit",
                            })}
                        </h1>
                    )} */}
                    </div>
                )}

                {/* Buttons */}
                <div className={`flex gap-1 ${view === "table-view" && "w-full"}`}>
                    {view === "calender-view" && (
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
                                    className="w-full text-foreground font-medium p-5 pl-9 cursor-pointer bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
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
                                        className="w-[252px] bg-background rounded-lg shadow-lg border"
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
                                className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none"
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
                                className="w-[41.6px] h-[41.6px] bg-background dark:hover:border-customBorder-dark hover:bg-muted dark:hover:bg-sidebar shadow-none"
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
        </div>
    );
}
