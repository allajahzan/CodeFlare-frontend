import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertTriangle,
    CalendarCogIcon,
    ChevronDown,
    ChevronUp,
    Search,
    UserRound,
} from "lucide-react";
import profile from "@/assets/images/no-profile.svg";
import { useContext, useState } from "react";
import { IAttendence, IUser } from "@/types/attendence";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IBatch } from "@/types/batch";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import { handleCustomError } from "@/utils/error";
import { postData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { IUserContext, UserContext } from "@/context/user-context";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Interface for flagged student
export interface IFlaggedStudent {
    userId: string;
    user: IUser;
    batch: IBatch;
    status: string;
    count: number;
    records: IAttendence[];
}

// Interface for Props
interface Propstype {
    flaggedStudents: {
        userId: string;
        user: IUser;
        batch: IBatch;
        status: string;
        count: number;
        records: IAttendence[];
    }[];
    fetching: boolean;
}

function FlaggedStudents({ flaggedStudents, fetching }: Propstype) {
    // Expand states
    const [expanded, setExpanded] = useState<string | null>(null);
    const toggle = (id: string) => setExpanded(expanded === id ? null : id);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Handle warning
    const handleWarning = async (
        studentId: string,
        count: number,
        status: string
    ) => {
        try {
            // Send request
            const resp = await postData(
                ApiEndpoints.WARNING,
                {
                    warning: {
                        studentId,
                        coordinatorId: user?._id,
                        message: `Warning from coordinator - you have reached count of ${count} ${status} already. Please reply to this warning asap or else you will be blocked from the appication.`,
                        date: new Date(),
                    },
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                console.log(data);
            }
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

    return (
        <>
            {flaggedStudents.length > 0 && (
                <div className="flex flex-col gap-2 overflow-auto no-scrollbar text-foreground">
                    {flaggedStudents.map((attendence, index) => (
                        <motion.div
                            key={attendence.userId}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="rounded-lg border border-border dark:border-transparent dark:bg-sidebar 
                    hover:bg-muted/50 dark:hover:bg-sidebar-backgroundDark shadow-sm"
                        >
                            <div
                                className="grid grid-cols-12 items-center p-4 py-2 cursor-pointer"
                                onClick={() => toggle(attendence.userId)}
                            >
                                {/* Avatar + Name */}
                                <div className="col-span-4 flex items-center gap-2">
                                    <Avatar className="bg-background w-10 h-10 border-2 border-background dark:border-border shadow-md">
                                        <AvatarImage
                                            src={attendence.user.profilePic}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent">
                                            <img src={profile} alt="" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="font-medium">{attendence.user.name}</p>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {attendence.batch.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Count + Status */}
                                <div className="col-span-6 text-sm flex items-center gap-2 text-muted-foreground">
                                    <span className="whitespace-nowrap">{attendence.count}x</span>
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
                                </div>

                                {/* Chevron Icon */}
                                <div className="col-span-2 flex justify-end">
                                    {expanded === attendence.userId ? (
                                        <ChevronUp className="w-5 h-5 text-foreground" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-foreground" />
                                    )}
                                </div>
                            </div>

                            {expanded === attendence.userId && (
                                <div className="p-5 px-4 py-2  border-t relative">
                                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-foreground py-3">
                                        <div className="col-span-4 text-start">Date</div>
                                        <div className="col-span-4 text-start">Reason</div>
                                        {/* <div className="col-span-4 text-start">Check In / Out</div> */}
                                    </div>

                                    {attendence.records.map((rec, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-12 gap-4 py-3 text-sm text-muted-foreground font-medium"
                                        >
                                            <div className="col-span-4 text-start">
                                                {new Date(rec.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="col-span-4 text-start">
                                                {rec.reason?.description || "NILL"}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="absolute top-4 right-4">
                                        <Button
                                            onClick={() =>
                                                handleWarning(
                                                    attendence.userId,
                                                    attendence.count,
                                                    attendence.status
                                                )
                                            }
                                            variant="outline"
                                            size="sm"
                                            className="duration-0 text-sm flex items-center gap-2 border-red-200 dark:border-red-800 bg-red-600/20 hover:bg-red-600/30 
                                                    text-red-600 hover:text-red-600 font-medium shadow-sm
                                                    "
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Send warning
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* If no flaggedstudents */}
            {flaggedStudents.length === 0 && (
                <NotFoundOrbit
                    MainIcon={UserRound}
                    SubIcon={fetching ? Search : CalendarCogIcon}
                    message={
                        fetching
                            ? "Please wait a moment"
                            : "No flagged students in this month"
                    }
                    text={fetching ? "Fetching..." : "No flagged students"}
                    className="w-full h-full"
                />
            )}
        </>
    );
}

export default FlaggedStudents;
