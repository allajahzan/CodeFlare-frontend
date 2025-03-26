import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import {
    Ban,
    CalendarDays,
    CalendarIcon,
    CircleCheckBig,
    CircleDashed,
    CircleX,
    Clock,
    Copy,
    Hourglass,
    Loader2,
    LucideProps,
    Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LineCharts from "@/components/common/charts/Line-chart";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import UserNameCard from "@/components/common/user/user-name-card";
import InfoCard from "@/components/common/other-cards/info-card";
import { IReview } from "@/types/review";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { NotSelected } from "@/components/animation/fallbacks";
import { Input } from "@/components/ui/input";

// Interface for Props
interface PropsType {
    reviews: IReview[];
    selectedReview: IReview | null;
    fetching: boolean;
}

// Review details
function ReviewDetails({ selectedReview }: PropsType) {
    const [statusColor, setStatusColor] = useState<string>("");
    const [statusIcon, setStatusIcon] =
        useState<
            React.ForwardRefExoticComponent<
                Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
            >
        >(CircleDashed);

    // Horizontal scroll
    let cardsListsRef = useRef<HTMLDivElement | null>(null);

    const onwheel = (event: any): void => {
        (cardsListsRef.current as HTMLDivElement).scrollLeft += event.deltaY;
        // (cardsListsRef.current as HTMLDivElement).style.scrollBehavior = "smooth";
    };

    // useEffect(() => {
    //     cardsListsRef.current?.addEventListener("wheel", onwheel);
    // }, []);

    // Update status color
    useEffect(() => {
        if (selectedReview?.status === "Pending") {
            setStatusColor("yellow");
            setStatusIcon(CircleDashed);
        } else if (selectedReview?.status === "Completed") {
            setStatusColor("green");
            setStatusIcon(CircleCheckBig);
        } else if (selectedReview?.status === "Absent") {
            setStatusColor("red");
            setStatusIcon(CircleX);
        } else {
            setStatusColor("purple");
            setStatusIcon(Ban);
        }
    }, [selectedReview]);

    return (
        <>
            {selectedReview && (
                <div
                    className="h-full p-5 rounded-2xl overflow-hidden border shadow-sm bg-background dark:bg-sidebar-background"
                >
                    <div key={selectedReview._id} className="space-y-5">
                        {/* Heading */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedReview.week[0].toUpperCase() +
                                        selectedReview.week.slice(1)}
                                </div>
                            </div>
                            <Badge
                                className={cn(
                                    "text-sm font-semibold self-start rounded-full duration-0",
                                    selectedReview.result === "Pass"
                                        ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                        : selectedReview.result === "Fail"
                                            ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                            : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                )}
                            >
                                {selectedReview.result}
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
                                className="relative flex flex-col justify-center p-0 bg-background dark:bg-sidebar rounded-md
                            before:content-[''] before:absolute before:-top-2.5 before:left-[25px] before:w-4 before:h-4 before:bg-background before:dark:bg-sidebar before:rotate-45
                            before:border-l-2 before:border-t-2 before:border-border before:border-dashed border-2 border-border border-dashed"
                            >
                                <Input
                                    value={selectedReview.feedback}
                                    readOnly
                                    className="border-none shadow-none p-3 py-[22.9px] text-foreground dark:bg-sidebar"
                                    placeholder="No feedback"
                                />
                            </motion.div>
                        </div>

                        {/* Info cards */}
                        <div
                            ref={cardsListsRef}
                            onWheel={onwheel}
                            className="flex gap-[13px] relative -top-1 w-full overflow-x-auto no-scrollbar whitespace-nowrap scrollbar-hide"
                        >
                            {/* Status */}
                            <motion.div
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0 }}
                            >
                                <InfoCard
                                    Icon={statusIcon}
                                    label="Status"
                                    text={selectedReview.status}
                                    iconDivClassName={`bg-${statusColor}-400/20 group-hover:bg-${statusColor}-400/30`}
                                    iconClassName={`text-${statusColor}-600`}
                                />
                            </motion.div>

                            {/* Score */}
                            <motion.div
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0 }}
                            >
                                <div className="group min-w-[250px] p-3 rounded-lg border border-border bg-background shadow-sm">
                                    <div className="relative flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-pink-400/20 group-hover:bg-pink-400/30">
                                            <Trophy className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="text-start w-full">
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Score
                                            </p>
                                            {selectedReview.score ? (
                                                <div className="flex items-center gap-2">
                                                    <p className="text-foreground font-semibold">
                                                        Practical :{" "}
                                                        {selectedReview?.score?.practical as number}
                                                    </p>
                                                    <p className="text-foreground font-semibold">
                                                        Theory : {selectedReview?.score?.theory as number}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-foreground font-semibold">NILL</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                <InfoCard
                                    Icon={CalendarDays}
                                    label="Reveiw Date"
                                    text={new Date(selectedReview.date).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
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
            )}

            {/* No review selected */}
            {!selectedReview && (
                <NotSelected
                    className="h-[309.95px]"
                    MainIcon={CalendarIcon}
                    text="No review selected"
                    message="Select a review to view details"
                />
            )}
        </>
    );
}

// Interface for monthly data
interface IWeekData {
    week: string;
    score: number;
}

// Pending and chart Component
function PendingsAndChart({ selectedReview, reviews, fetching }: PropsType) {
    const [monthlyData, setMonthlyData] = useState<IWeekData[] | []>([]);

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

    useEffect(() => {
        let data = reviews
            .map((review: IReview) => {
                if (review.score) {
                    return {
                        week: review.week,
                        score: review.score && review.score.practical + review.score.theory,
                    };
                }
            })
            .filter((_, index) => index < 5);

        setMonthlyData(data as IWeekData[]);
    }, [reviews]);

    return (
        <div className="h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {/* pendings card */}
            <div
                className="p-5 bg-zinc-0 rounded-2xl border border-border dark:border-customBorder 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {selectedReview && (
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
                                Pendings ({selectedReview.title.toUpperCase()})
                            </motion.p>
                            {selectedReview.pendings.length > 0 && (
                                <div
                                    onClick={() =>
                                        handleCopy(selectedReview.pendings as string[])
                                    }
                                    className="p-2 absolute right-0 top-0 bg-muted rounded-full cursor-pointer"
                                >
                                    <Copy className="w-4 h-4 text-foreground" />
                                </div>
                            )}
                        </div>
                        {/* Pendings */}
                        {selectedReview.pendings.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <div className="h-[170px] sm:h-[206px] flex flex-col gap-1 overflow-x-hidden overflow-auto no-scrolbar">
                                    <ul className="space-y-2.5">
                                        {["Event looop", "Js engine"].map((pending, index) => (
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
                                    </ul>
                                </div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex items-center justify-center h-[170px] sm:h-[206px]">
                                <p className="text-foreground text-sm font-semibold">
                                    No pendings are added
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* No review selected */}
                {!selectedReview && (
                    <NotSelected
                        className="h-[214px] sm:h-[250px] border-none shadow-none"
                        MainIcon={CalendarIcon}
                        text="No review selected"
                        message="Select a review to view pendings"
                    />
                )}
            </div>

            {/* chart for overall performance*/}
            <div
                className="h-fit p-5 bg-zinc-0 rounded-2xl border border-border dark:border-customBorder 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {reviews.length > 0 && (
                    <LineCharts
                        data={monthlyData}
                        text="Overall Performance"
                        className="h-[170px] sm:h-[206px]"
                    />
                )}

                {/* If no reviews */}
                {reviews.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center h-[170px] sm:h-[250px]"
                    >
                        {fetching ? (
                            <Loader2 className="w-5 h-5 animate-spin text-foreground" />
                        ) : (
                            <p className="text-center text-foreground text-sm font-semibold">
                                No reviews found
                            </p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export { ReviewDetails, PendingsAndChart };
