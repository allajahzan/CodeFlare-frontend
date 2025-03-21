import { cn } from "@/lib/utils";
import {
    Camera,
    Clock,
    Dot,
    FileSpreadsheetIcon,
    Hourglass,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { motion } from "framer-motion";
import UserNameCard from "../common/user/user-name-card";
import InfoCard from "../common/other-cards/info-card";
import { Badge } from "../ui/badge";
import CardHeader from "../common/data-card/header";
import image1 from "@/assets/images/allaj.jpeg";
import { CalendarHeader } from "./header";
import SelfieModal from "./selfie-modal";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import PieCharts from "../common/charts/pie-chart";

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
        <div className="w-full overflow-hidden grid grid-cols-3 gap-5 text-center text-foreground font-semibold">
            {/* Right side*/}
            <div className="h-[calc(100vh-108px)] sticky top-0 bg-background dark:bg-sidebar-background p-5 border flex flex-col gap-5 rounded-2xl shadow-sm overflow-hidden">
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
                                <div className="hidden xflex items-center p-2 rounded-full">
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

            {/* Right side */}
            <div className="h-full grid grid-rows-[auto,1fr,auto] space-y-5 col-span-2 overflow-auto no-scrollbar">
                {/* Scroll container*/}
                <div className="relative p-5 flex flex-col gap-3 border bg-background dark:bg-sidebar-background rounded-2xl shadow-sm row-span-1">
                    {/* Student info */}
                    <div className="flex items-center justify-between mb-2">
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
                        <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg relative overflow-hidden">
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
                        <div className="min-w-[250px] w-full  min-h-min bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 rounded-lg relative overflow-hidden">
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
                        <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg relative overflow-hidden">
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

                    {/* Break */}
                    <p className="text-start text-base w-full flex items-center gap-1">
                        Break snapshots
                    </p>

                    {/* Selfie updated with modal */}
                    <SelfieModal
                        children={
                            // <div className="group min-h-min bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 relative overflow-hidden">
                            //     <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 dark:bg-blue-700/20 rounded-bl-full opacity-30"></div>
                            //     <div className="flex items-start gap-3">
                            //         <div className="p-2 bg-blue-400/20 group-hover:bg-blue-400/30 rounded-lg">
                            //             <Minus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            //         </div>
                            //         <div className="flex-1">
                            //             <div className="flex items-center justify-between">
                            //                 <h3 className="text-sm font-semibold text-foreground">
                            //                     Status
                            //                 </h3>
                            //                 <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                            //                     Snapshots
                            //                 </p>
                            //             </div>
                            //             <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-700/30 rounded-full overflow-hidden">
                            //                 <motion.div
                            //                     className="h-full bg-blue-400 dark:bg-blue-400"
                            //                     initial={{ width: 0 }}
                            //                     animate={{ width: "70%" }}
                            //                     transition={{ delay: 0.5, duration: 1 }}
                            //                 />
                            //             </div>
                            //             {/* <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                            //                 <span>Start: 9:00 AM</span>
                            //                 <span>End: 5:30 PM</span>
                            //             </div> */}
                            //         </div>
                            //     </div>
                            // </div>
                            <div>
                                <InfoCard
                                    Icon={Camera}
                                    label="Attendence"
                                    text="Verification Snapshots"
                                    iconClassName="text-blue-600"
                                    iconDivClassName="bg-blue-400/20 group-hover:bg-blue-400/30"
                                    className="w-full shadow-sm dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                                />
                            </div>
                        }
                    />

                    {/* Reason */}
                    <p className="text-start text-base w-full flex items-center gap-1">
                        Reason
                    </p>

                    {/* Reason */}
                    <Accordion type="single" collapsible>
                        <AccordionItem
                            value="item-1"
                            className="border-b-0 relative flex flex-col gap-3"
                        >
                            <AccordionTrigger>
                                <InfoCard
                                    Icon={FileSpreadsheetIcon}
                                    label="Absent / Late"
                                    text="Reason"
                                    iconClassName="text-orange-600"
                                    iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                                    className="w-full shadow-sm dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                                />
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="relative flex flex-col gap-3 p-5 border dark:border-transparent bg-background dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark rounded-lg">
                                    {/* Time */}
                                    <div className="space-y-2 relative text-start">
                                        {/* Label */}
                                        <Label className="text-sm text-foreground font-medium">
                                            Time
                                        </Label>

                                        {/* Time */}
                                        <div className="relative">
                                            <Input
                                                id="time"
                                                type="text"
                                                placeholder="Time"
                                                readOnly
                                                required
                                                defaultValue={"8:55 AM"}
                                                className="text-foreground font-medium p-5 pl-9 border"
                                            />
                                            <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="space-y-2 relative text-start">
                                        {/* Label */}
                                        <Label className="text-sm text-foreground font-medium">
                                            Reason
                                        </Label>

                                        {/* Time */}
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Reason"
                                                readOnly
                                                rows={3}
                                                className="text-foreground font-medium border bg-background resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Graphs */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Pie graph */}
                    <div className="w-full h-fit bg-background dark:bg-sidebar-background text-start p-5 border rounded-2xl">
                        <PieCharts
                            data={[
                                { name: "Present", value: 50 },
                                { name: "Absent", value: 20 },
                                { name: "Late", value: 15 },
                                { name: "Excused", value: 15 },
                            ]}
                            text="Today's Overview"
                            className="h-[220px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
