import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CalendarCogIcon,
    List,
    Search,
    TriangleAlert,
    UserRound,
} from "lucide-react";
import profile from "@/assets/images/no-profile.svg";
import { useState } from "react";
import { IAttendence, IUser } from "@/types/IAttendence";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IBatch } from "@/types/IBatch";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import ViewAllReasonsModal from "./modal-reasons-list";
import { Button } from "@/components/ui/button";
import WarningsListsModal from "./modal-warnings-list";
import SendWarningModal from "./modal-send-warning";
import { IWarning } from "@/types/IWarning";

// Interface for flagged student
export interface IDefaulters {
    userId: string;
    user: IUser;
    batch: IBatch;
    status: string;
    count: number;
    records: IAttendence[];
    warnings: IWarning[];
}

// Interface for Props
interface Propstype {
    defaulters: IDefaulters[];
    setDefaulters: React.Dispatch<React.SetStateAction<[] | IDefaulters[]>>;
    fetching: boolean;
    divRef: React.RefObject<HTMLDivElement>;
    handleInfiniteScroll: () => Promise<void>;
}

// monthly defaulters Component
function MonthlyDefaulters({
    defaulters,
    setDefaulters,
    fetching,
    divRef,
    handleInfiniteScroll,
}: Propstype) {
    // Expand states
    const [expanded, setExpanded] = useState<string | null>(null);

    // Handle toggle
    const toggle = (id: string) => setExpanded(expanded === id ? null : id);

    return (
        <>
            {defaulters.length > 0 && (
                <div
                    ref={divRef}
                    onScroll={handleInfiniteScroll}
                    className="flex flex-col gap-2 overflow-auto no-scrollbar text-foreground"
                >
                    {defaulters.map((attendence, index) => (
                        <motion.div
                            key={attendence.userId}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index % 10) * 0.1 }}
                            className="rounded-lg border border-border dark:border-transparent dark:bg-sidebar 
                            hover:bg-muted/60 dark:hover:bg-sidebar-backgroundDark shadow-sm"
                        >
                            <div
                                className="flex items-center gap-2 p-4 py-2 cursor-pointer"
                                onClick={() => toggle(attendence.userId)}
                            >
                                {/* Avatar + Name */}
                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <Avatar className="bg-background w-10 h-10 border-2 border-background dark:border-border shadow-md">
                                        <AvatarImage
                                            src={attendence.user.profilePic}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent">
                                            <img src={profile} alt="" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                            {attendence.user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground font-medium truncate">
                                            {attendence.batch.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Count + Status */}
                                <div onClick={(e) => e.stopPropagation()}>
                                    <ViewAllReasonsModal
                                        status={attendence.status}
                                        records={attendence.records}
                                        children={
                                            <div className="text-sm flex items-center gap-2 text-foreground font-medium cursor-pointer flex-shrink-0">
                                                <span className="whitespace-nowrap">
                                                    {attendence.count}x
                                                </span>
                                                <Badge
                                                    className={cn(
                                                        "text-sm font-semibold rounded-full duration-0",
                                                        attendence.status === "Absent"
                                                            ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                            : attendence.status === "Late"
                                                                ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                                                : ""
                                                    )}
                                                >
                                                    {attendence.status}
                                                </Badge>
                                                <List className="h-4 w-4 text-foreground" />
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {expanded === attendence.userId && (
                                <div className="p-5 border-t relative flex items-center gap-2">
                                    <WarningsListsModal
                                        student={attendence.user}
                                        warnings={attendence.warnings}
                                        children={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="min-w-0 duration-0 text-sm flex items-center gap-2 font-medium shadow-sm bg-sidebar-backgroundDark
                                               "
                                            >
                                                <TriangleAlert className="h-5 w-5 text-foreground" />
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    Warnings & replies
                                                </span>
                                            </Button>
                                        }
                                    />
                                    <SendWarningModal
                                        student={attendence.user}
                                        setDefaulters={setDefaulters}
                                        children={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="duration-0 text-sm flex items-center gap-2 font-medium shadow-sm
                                             bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800"
                                            >
                                                <TriangleAlert className="h-5 w-5 text-red-800 dark:text-red-600" />
                                                <span className="text-sm font-medium text-red-800 dark:text-red-600">
                                                    Warn
                                                </span>
                                            </Button>
                                        }
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* If no defaulters */}
            {defaulters.length === 0 && (
                <NotFoundOrbit
                    MainIcon={UserRound}
                    SubIcon={fetching ? Search : CalendarCogIcon}
                    message={
                        fetching
                            ? "Please wait a moment"
                            : "No attendence defaulters in this month"
                    }
                    text={fetching ? "Fetching..." : "No defaulters"}
                    className="w-full h-full"
                />
            )}
        </>
    );
}

export default MonthlyDefaulters;
