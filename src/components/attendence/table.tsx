import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Calendar1,
    ChevronDown,
    ChevronsRightIcon,
    Clock,
    Dot,
    Eye,
    File,
    Hourglass,
    LogOut,
    MapPin,
    Minus,
    Plus,
    UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { motion } from "framer-motion";
import UserNameCard from "../common/user/user-name-card";
import InfoCard from "../common/other-cards/info-card";
import { Badge } from "../ui/badge";
import CardHeader from "../common/data-card/header";
import image from "@/assets/images/allaj1.png";
import image1 from "@/assets/images/allaj.jpeg";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { CalendarHeader } from "./header";
import SelfieModal from "./selfie-modal";

interface Propstype {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;
}

// Component
function Table({
    currentDate,
    onNextMonth,
    view,
    setView,
    onPreviousMonth,
}: Propstype) {
    return (
        <div className="w-full grid grid-cols-3 gap-5 text-center text-foreground font-semibold">
            {/* List */}
            <div className="h-[calc(100vh-108px)] dark:bg-sidebar-background p-5 border flex flex-col gap-5 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <CardHeader count={4} heading="Attedence list" />

                {/* Filter and view */}
                <CalendarHeader
                    currentDate={currentDate}
                    onPreviousMonth={onPreviousMonth}
                    onNextMonth={onNextMonth}
                    view={view}
                    setView={setView}
                />

                {/* Lists */}
                <div className="h-full flex flex-col items-center gap-[10px] overflow-auto no-scrollbar">
                    {/* List */}
                    {["Pending", "Absent", "Present", "Late"].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            // onClick={() => action(index)}
                            className={cn(
                                "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
                                // selectedUser?._id === user._id ? "bg-muted dark:bg-sidebar" : "",
                                // className
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar profile pic */}
                                <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                                    <AvatarImage className="object-cover" />
                                    <AvatarFallback className="bg-transparent">
                                        <img className="w-full" src={profile} alt="" />
                                    </AvatarFallback>
                                </Avatar>

                                {/* Name and other details */}
                                <div className="flex-1 min-w-0 truncate">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground truncate">
                                            {"Ahsan allaj pk"}{" "}
                                        </p>
                                    </div>

                                    {/* Batch and date */}
                                    <div className="flex items-center gap-0">
                                        <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium">
                                            {/* <UsersRound className="w-3 h-3" /> */}
                                            Batch 1
                                        </p>
                                        <Dot className="p-0 text-muted-foreground flex-shrink-0" />
                                        <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium">
                                            {/* <Calendar1 className="w-3 h-3" /> */}
                                            {new Date().toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Status color */}
                                <div className="flex items-center p-2 rounded-full">
                                    {(() => {
                                        switch (item) {
                                            case "Pending":
                                                return (
                                                    <div className="p-1 rounded-full bg-yellow-400/40 group-hover:bg-yellow-400/50"></div>
                                                );
                                            case "Late":
                                                return (
                                                    <div className="p-1 rounded-full bg-purple-400/40 group-hover:bg-purple-400/50"></div>
                                                );
                                            case "Absent":
                                                return (
                                                    <div className="p-1 rounded-full bg-red-400/40 group-hover:bg-red-400/50"></div>
                                                );
                                            case "Present":
                                                return (
                                                    <div className="p-1 rounded-full bg-green-400/40 group-hover:bg-green-400/50"></div>
                                                );

                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="h-[calc(100vh-108px)] p-5 dark:bg-sidebar-background border flex flex-col gap-5 rounded-2xl shadow-sm overflow-hidden col-span-2">
                <div className="flex items-center justify-between">
                    <UserNameCard
                        data={{
                            name: "Ahsan allaj pk",
                            email: "ahsanallajpk23@gmaill.com",
                            role: "Student",
                            profilePic: image1,
                        }}
                    />

                    <Badge
                        className={cn(
                            "self-start text-sm font-semibold rounded-full duration-0",
                            status === "Pass"
                                ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                : status === "Fail"
                                    ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                    : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                        )}
                    >
                        {status || "Pending"}
                    </Badge>
                </div>

                {/* Time line*/}
                <p className="text-start text-base w-full flex items-center gap-1">
                    Timeline
                </p>

                {/* Time and duration info cards */}
                <div className="min-h-min flex gap-3 overflow-scroll overflow-y-hidden no-scrollbar">
                    
                    {/* CheckIn */}
                    <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-700/20 rounded-bl-full opacity-50"></div>
                        <InfoCard
                            Icon={LogOut}
                            label="Check-In Time"
                            text="9:00 AM"
                            iconClassName="text-green-600"
                            iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                            className="w-full border-none bg-transparent"
                        />
                    </div>

                    {/* CheckOut */}
                    <div className="min-w-[250px] w-full  min-h-min bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200 dark:bg-pink-700/20 rounded-bl-full opacity-50"></div>
                        <InfoCard
                            Icon={LogOut}
                            label="Check-Out Time"
                            text="5:30 PM"
                            iconClassName="text-pink-600"
                            iconDivClassName="bg-pink-400/20 group-hover:bg-pink-400/30 rotate-180"
                            className="w-full border-none bg-transparent"
                        />
                    </div>

                    {/* Duration */}
                    <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-700/20 rounded-bl-full opacity-50"></div>
                        <InfoCard
                            Icon={Hourglass}
                            label="Duration"
                            text="8 Hours"
                            iconClassName="text-purple-600"
                            iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                            className="w-full border-none bg-transparent"
                        />
                    </div>
                </div>

                {/* Selfie uploaded */}
                <div className="h-full flex flex-col gap-5 overflow-auto no-scrollbar">
                    <p className="text-start text-base w-full flex items-center gap-1">
                        Break snapshots
                    </p>

                    {/* Selfie updated with modal */}
                    <SelfieModal
                        children={
                            <div className="group min-h-min bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 dark:bg-blue-700/20 rounded-bl-full opacity-30"></div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-400/20 group-hover:bg-blue-400/30 rounded-lg">
                                        <Minus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-foreground">
                                                Status
                                            </h3>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                                Snapshots
                                            </p>
                                        </div>
                                        <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-700/30 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-400 dark:bg-blue-400"
                                                initial={{ width: 0 }}
                                                animate={{ width: "70%" }}
                                                transition={{ delay: 0.5, duration: 1 }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Start: 9:00 AM</span>
                                            <span>End: 5:30 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <p className="text-start text-base w-full flex items-center gap-1">
                        Reason
                    </p>

                    <div key={1} className="relative h-full flex items-center">
                        <div className="group h-full w-full p-3 rounded-lg bg-muted dark:bg-sidebar shadow-sm flex flex-col gap-3">
                            {/* Header Section */}
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg")}>
                                    <Minus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-start">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Reason
                                    </p>
                                    <p className="text-foreground font-semibold">Reason</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="flex items-center gap-3">
                        <Button className="w-full h-11 shadow-md disabled:cursor-not-allowed">
                            Approve
                        </Button>
                    </div> */}
                </div>
            </div>

            {/* Modal */}
        </div>
    );
}

export default Table;
