import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    List,
    CalendarDays,
    Clock,
    CalendarCheck2,
} from "lucide-react";
import { ToolbarProps, View, Navigate } from "react-big-calendar";

const CustomToolbar: React.FC<ToolbarProps> = ({
    label,
    onNavigate,
    view,
    onView,
}) => {
    return (
        <div className="rbc-toolbar">
            {/* Left Side: Navigation Buttons */}
            <span className="rbc-btn-group">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className="nav-btn"
                            onClick={() => onNavigate(Navigate.TODAY)}
                        >
                            <CalendarCheck2 className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Today</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className="nav-btn"
                            onClick={() => onNavigate(Navigate.PREVIOUS)}
                        >
                            <ChevronLeft className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Previous</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className="nav-btn"
                            onClick={() => onNavigate(Navigate.NEXT)}
                        >
                            <ChevronRight className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Next</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </span>

            {/* Center: Current Month/Year Label */}
            <span className="rbc-toolbar-label">{label}</span>

            {/* Right Side: View Switch Buttons */}
            <span className="rbc-btn-group">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={view === "month" ? "rbc-active" : ""}
                            onClick={() => onView("month" as View)}
                        >
                            <Calendar className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Month</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={view === "week" ? "rbc-active" : ""}
                            onClick={() => onView("week" as View)}
                        >
                            <CalendarDays className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Week</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={view === "day" ? "rbc-active" : ""}
                            onClick={() => onView("day" as View)}
                        >
                            <Clock className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Today</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={view === "agenda" ? "rbc-active" : ""}
                            onClick={() => onView("agenda" as View)}
                        >
                            <List className="w-4 h-4 text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            className="text-foreground dark:bg-sidebar border borer-2 -ml-0 "
                        >
                            <p style={{ fontSize: "13px" }}>Agenda</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </span>
        </div>
    );
};

export default CustomToolbar;
