import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDays,
    CircleDashed,
    Clock,
    Copy,
    Hourglass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LineCharts from "@/components/common/charts/Line-chart";
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import UserNameCard from "@/components/common/user/user-name-card";
import InfoCard from "@/components/common/other-cards/info-card";
import { IReview } from "@/types/review";
import { convertTo12HourFormat } from "@/utils/time-converter";

// Interface for Props
interface PropsType {
    selectedReview: IReview;
}

// Review details
function ReviewDetails({ selectedReview }: PropsType) {
    return (
        <div
            className="h-full p-5 rounded-2xl overflow-hidden border border-border dark:border-customBorder
        shadow-sm dark:shadow-customBorder dark:shadow-inner"
        >
            <div key={selectedReview._id} className="space-y-5">
                {/* Heading */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="text-lg text-foreground font-semibold">
                            Week {selectedReview.week}
                        </div>
                    </div>
                    <Badge
                        className={cn(
                            "text-sm font-semibold self-start rounded-full duration-0",
                            selectedReview.status === "Pass"
                                ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                : "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                        )}
                    >
                        {selectedReview.status}
                    </Badge>
                </div>

                {/* Instructor section */}
                <div className="flex flex-col gap-5">
                    {/* Name */}
                    <UserNameCard
                        data={{
                            name: selectedReview.instructor.name,
                            email: selectedReview.instructor.name,
                            role: "Instructor",
                            profilePic: selectedReview.instructor.profilePic,
                        }}
                    />

                    {/* Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 12,
                            delay: 0.2,
                        }}
                        className="relative flex flex-col justify-center p-3 bg-background dark:bg-sidebar rounded-md
                                before:content-[''] before:absolute before:-top-2.5 before:left-[25px] before:w-4 before:h-4 before:bg-background before:dark:bg-sidebar before:rotate-45
                                before:border-l-2 before:border-t-2 before:border-border before:border-dashed border-2 border-border border-dashed"
                    >
                        <p className="text-foreground font-medium md:text-nowrap overflow-x-auto no-scrollbar">
                            {selectedReview.feedback}
                        </p>
                    </motion.div>
                </div>

                {/* Info cards */}
                <div className="flex gap-[13px] relative -top-1 w-full overflow-x-auto no-scrollbar whitespace-nowrap scrollbar-hide">
                    {/* Status */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0 }}
                    >
                        <InfoCard
                            Icon={CircleDashed}
                            label="Status"
                            text={"Pending"}
                            iconDivClassName="bg-yellow-400/20 group-hover:bg-yellow-400/30"
                            iconClassName="text-yellow-600"
                        />
                    </motion.div>

                    {/* Sheduled date */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0 }}
                    >
                        <InfoCard
                            Icon={CalendarDays}
                            label="Sheduled Date"
                            text={new Date(selectedReview.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                            iconDivClassName="bg-blue-400/20 group-hover:bg-blue-400/30"
                            iconClassName="text-blue-600"
                        />
                    </motion.div>

                    {/* Review date */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0 }}
                    >
                        {" "}
                        <InfoCard
                            Icon={CalendarDays}
                            label="Reveiw Date"
                            text={new Date(selectedReview.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                            iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                            iconClassName="text-orange-600"
                        />
                    </motion.div>

                    {/* Time */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0 }}
                    >
                        {" "}
                        <InfoCard
                            Icon={Clock}
                            label="Time"
                            text={convertTo12HourFormat(selectedReview.time)}
                            iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                            iconClassName="text-green-600"
                        />
                    </motion.div>

                    {/* Duration */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0 }}
                    >
                        <InfoCard
                            Icon={Hourglass}
                            label="Duration"
                            text={"1 Hour"}
                            iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                            iconClassName="text-purple-600"
                        />{" "}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// pendings and chart
const monthlyData = [
    { week: "1", score: 2 },
    { week: "2", score: 10 },
    { week: "3", score: 8 },
    { week: "5", score: 12 },
];

// Pending and chart Component
function PendingsAndChart({ selectedReview }: PropsType) {
    // copy to clipboard
    const handleCopy = useCallback(
        async (texts: string[]) => {
            try {
                await navigator.clipboard.writeText(texts.toString());
                toast({ title: "Pendings are copied to clipboard" });
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
                toast({ title: "Failed to copy to clipboard" });
            }
        },
        [toast]
    );
    return (
        <div className="h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {/* pendings card */}
            <div
                className="p-5 bg-zinc-0 rounded-2xl border border-border dark:border-customBorder 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                <div
                    className="h-full w-full flex flex-col gap-5"
                    key={selectedReview._id}
                >
                    {/* Heading */}
                    <div className="flex items-start justify-between relative">
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-base text-foreground font-medium truncate"
                        >
                            Pendings ({selectedReview.title})
                        </motion.p>
                        <div
                            onClick={() => handleCopy(selectedReview.pendings)}
                            className="p-2 absolute right-0 top-0 bg-muted rounded-full cursor-pointer"
                        >
                            <Copy className="w-4 h-4 text-foreground" />
                        </div>
                    </div>
                    {/* Pendings */}
                    <AnimatePresence mode="wait">
                        <div className="h-[170px] sm:h-[206px] flex flex-col gap-1 overflow-x-hidden overflow-auto no-scrolbar">
                            <motion.ul className="space-y-2.5">
                                {selectedReview.pendings.map((pending, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="text-foreground font-medium"
                                    >
                                        {pending}
                                    </motion.p>
                                ))}
                            </motion.ul>
                        </div>
                    </AnimatePresence>
                </div>
            </div>

            {/* chart for overall performance*/}
            <div
                className="h-fit p-5 bg-zinc-0 rounded-2xl border border-border dark:border-customBorder 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                <LineCharts
                    data={monthlyData}
                    text="Overall Performance"
                    className="h-[170px] sm:h-[206px]"
                />
            </div>
        </div>
    );
}

export { ReviewDetails, PendingsAndChart };
