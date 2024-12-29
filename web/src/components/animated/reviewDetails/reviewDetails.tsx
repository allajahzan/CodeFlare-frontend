import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Copy } from "lucide-react";
import { Review } from "@/pages/student/reviews";
import { cn } from "@/lib/utils";
import LineCharts from "@/components/Charts/LineChart";
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface PropsType {
    selectedReview: Review;
}

function ReviewDetails({ selectedReview }: PropsType) {
    return (
        <div className="h-full p-8 rounded-2xl shadow-custom overflow-hidden">
            <AnimatePresence mode="wait">
                {selectedReview && (
                    <motion.div
                        key={selectedReview.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            // transition: {
                            //     type: "spring",
                            //     stiffness: 400,
                            //     damping: 12,
                            //     duration: 0.3,
                            // },
                        }}
                        transition={{ delay: 0.2 }}
                        className="space-y-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">
                                    Week {selectedReview.week}
                                </div>
                                <div className="flex gap-1 items-center text-sm text-muted-foreground font-medium">
                                    <CalendarClock className="h-4 w-4" />
                                    {selectedReview.date}
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-sm font-semibold self-start",
                                    selectedReview.status === "Pass"
                                        ? "text-green-900"
                                        : "text-red-900"
                                )}
                            >
                                {selectedReview.status}
                            </Badge>
                        </div>

                        {/* feedback Section */}
                        <div className="space-y-2">
                            <p className="text-base font-semibold">Feedback</p>
                            <p className="font-medium truncate">{selectedReview.details}</p>
                        </div>

                        {/* <Separator className="rounded-full h-[2px] bg-muted" /> */}

                        {/* instructor section */}
                        {/* <div className="space-y-4">
                            <p className="text-base font-semibold">Review Details</p>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={allaj}
                                        alt={selectedReview.instructor}
                                        className="object-cover"
                                    />
                                    <AvatarFallback>
                                        <User2 />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center">
                                        <User2 className="mr-1 h-4 w-4" />
                                        <p className="font-semibold">{selectedReview.instructor}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {"Instructor"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center font-medium text-sm">
                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Started at:</span>
                                    <span className="ml-1">{"10:03 AM"}</span>
                                </div>
                                <Separator orientation="vertical" className="h-5" />
                                <div className="flex items-center font-medium">
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="ml-1">{"45 minutes"}</span>
                                </div>
                            </div>
                        </div> */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const monthlyData = [
    { week: "1", score: 2 },
    { week: "2", score: 10 },
    { week: "3", score: 8 },
    { week: "5", score: 12 },
];

function PendingsAndChart({ selectedReview }: PropsType) {
    // copy to clipboard
    const handleCopy = useCallback(
        async (texts: string[]) => {
            try {
                await navigator.clipboard.writeText(texts.toString());
                toast({ title: "Pendings copied to clipboard" });
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
                toast({ title: "Failed to copy to clipboard" });
            }
        },
        [toast]
    );
    return (
        <div className="h-fit grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* pendings */}
            <div className="p-8 bg-zinc-0 rounded-2xl shadow-custom">
                <AnimatePresence mode="wait">
                    {selectedReview && (
                        <motion.div
                            className="h-full w-full flex flex-col gap-5"
                            key={selectedReview.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                // transition: {
                                //     type: "spring",
                                //     stiffness: 400,
                                //     damping: 12,
                                //     duration: 0.3,
                                // },
                            }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-start justify-between relative">
                                <p className="text-base font-medium truncate">
                                    Pendings ({selectedReview.title})
                                </p>
                                <div
                                    onClick={() => handleCopy(selectedReview.pendings)}
                                    className="p-3 absolute -right-4 -top-2.5 bg-white hover:bg-zinc-100 rounded-lg cursor-pointer"
                                >
                                    <Copy className="w-5 h-5" />
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                <div className="h-[170px] sm:h-[280px] flex flex-col gap-1 overflow-x-hidden overflow-auto no-scrolbar">
                                    <motion.ul className="space-y-2">
                                        {selectedReview.pendings.map((pending, index) => (
                                            <motion.p
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                                className="font-medium"
                                            >
                                                {pending}
                                            </motion.p>
                                        ))}
                                    </motion.ul>
                                </div>
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* chart for monthly performance*/}
            <div className="h-fit p-8 bg-zinc-0 rounded-2xl shadow-custom">
                <LineCharts
                    data={monthlyData}
                    text="Last Month Performance"
                    className="h-[170px] sm:h-[280px]"
                />
            </div>
        </div>
    );
}

export { ReviewDetails, PendingsAndChart };
