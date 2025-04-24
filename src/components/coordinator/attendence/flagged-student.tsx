import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import profile from "@/assets/images/no-profile.svg";
import { useState } from "react";
import { IAttendence, IUser } from "@/types/attendence";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Interface for flagged student
export interface IFlaggedStudent {
    userId: string;
    user: IUser;
    status: string;
    count: number;
    records: IAttendence[];
}

// Interface for Props
interface Propstype {
    flaggedStudents: {
        userId: string;
        user: IUser;
        status: string;
        count: number;
        records: IAttendence[];
    }[];
}

function FlaggedStudents({ flaggedStudents }: Propstype) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const toggle = (id: string) => setExpanded(expanded === id ? null : id);

    return (
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
                            <p className="font-medium">{attendence.user.name}</p>
                        </div>

                        {/* Count + Status */}
                        <div className="col-span-6 text-sm flex items-center gap-2 text-muted-foreground">
                            <span className="whitespace-nowrap">{attendence.count}x</span>
                            <Badge
                                className={cn(
                                    "text-xs font-semibold rounded-full duration-0",
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
                                    {/* <div className="col-span-4 text-start">
                                        {rec.checkIn ? convertTo12HourFormat(rec.checkIn) : "--:--"}{" "}
                                        /{" "}
                                        {rec.checkOut
                                            ? convertTo12HourFormat(rec.checkOut)
                                            : "--:--"}
                                    </div> */}
                                </div>
                            ))}

                            <div className="absolute top-4 right-4">
                                <Button
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
    );
}

export default FlaggedStudents;
