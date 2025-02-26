import { NotSelected } from "@/components/animation/fallbacks";
import InfoCard from "@/components/common/other-cards/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDays,
    CircleDashed,
    Clock,
    Edit2,
    Hourglass,
} from "lucide-react";
import { Review } from "./reviews";
import { useEffect, useRef } from "react";

// Interface for Props
interface PropsType {
    selectedReview: Review | null;
}

// Review details Component
function ReviewDetails({ selectedReview }: PropsType) {
    // Horizontal scroll
    let cardsListsRef = useRef<HTMLDivElement | null>(null);

    const onwheel = (event: any): void => {
        (cardsListsRef.current as HTMLDivElement).scrollLeft += event.deltaY;
    };

    useEffect(() => {
        cardsListsRef.current?.addEventListener("wheel", onwheel);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {selectedReview && (
                <div
                    className="h-full p-5 rounded-2xl overflow-hidden border border-border
                dark:bg-background shadow-sm"
                >
                    <div key={selectedReview.id} className="space-y-5">
                        {/* Heading */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedReview.week}
                                </div>
                            </div>

                            <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                <Edit2 className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Instructor section */}
                        <div className="flex flex-col gap-5">
                            {/* Name */}
                            <UserNameCard
                                data={{
                                    name: selectedReview.student.name,
                                    email: selectedReview.student.email,
                                    role: selectedReview.student.role,
                                    profilePic: selectedReview.student.profilePic,
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
                                    className="border-none shadow-none p-3 py-[22.9px] text-foreground dark:bg-sidebar"
                                    placeholder="Enter your feedback for this student"
                                />
                            </motion.div>
                        </div>

                        {/* Info cards */}
                        <div
                            ref={cardsListsRef}
                            className="flex gap-[13px] relative -top-1 w-full overflow-scroll overflow-y-hidden no-scrollbar whitespace-nowrap scrollbar-hide"
                        >
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
                                    text={selectedReview.date}
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
                                    text={selectedReview.date}
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
                                    text={selectedReview.date}
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
                                    text={selectedReview.date}
                                    iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                                    iconClassName="text-purple-600"
                                />{" "}
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}

            {/* No user selected */}
            {!selectedReview && (
                <NotSelected
                    MainIcon={CalendarDays}
                    message={`Select a review from the list to view their details`}
                    text={`No review selected`}
                    className="h-[313.95px]"
                />
            )}
        </AnimatePresence>
    );
}

export default ReviewDetails;
