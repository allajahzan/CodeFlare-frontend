import { NotSelected } from "@/components/animation/fallbacks";
import InfoCard from "@/components/common/other-cards/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDays,
    Check,
    CircleDashed,
    Clock,
    Edit2,
    Hourglass,
    Loader2,
    Trophy,
} from "lucide-react";
import { Review } from "./reviews";
import { useEffect, useRef, useState } from "react";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { handleCustomError } from "@/utils/error";
import { patchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import UpdateReviewsheet from "./sheet-update-review";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddMarkModal from "./modal-add-mark";
import { toast } from "@/hooks/use-toast";

// Interface for Props
interface PropsType {
    setReviews: React.Dispatch<React.SetStateAction<[] | Review[]>>;
    setSelectedReview: React.Dispatch<React.SetStateAction<Review | null>>;
    selectedReview: Review | null;
}

// Review details Component
function ReviewDetails({
    setReviews,
    selectedReview,
    setSelectedReview,
}: PropsType) {
    // Feedback
    const [feedback, setFeedback] = useState<string>("");
    const [debouncedFeedback, setDebouncedFeedback] = useState<string>("");

    // Status
    const [status, setStatus] = useState<string>(selectedReview?.status || "");
    const [changingStatus, setChangingStatus] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Horizontal scroll
    let cardsListsRef = useRef<HTMLDivElement | null>(null);

    const onwheel = (event: any): void => {
        (cardsListsRef.current as HTMLDivElement).scrollLeft += event.deltaY;
    };

    useEffect(() => {
        cardsListsRef.current?.addEventListener("wheel", onwheel);
    }, []);

    // Reset feedback
    useEffect(() => {
        setFeedback(selectedReview?.feedback || "");
    }, [selectedReview]);

    // Debounce feedback
    useEffect(() => {
        if (feedback === selectedReview?.feedback) return;

        const handler = setTimeout(() => {
            setDebouncedFeedback(feedback);
        }, 500);

        return () => clearTimeout(handler);
    }, [feedback]);

    // Update status
    const updateStatus = async (status: string) => {
        try {
            if (selectedReview?.status === status) return;

            setChangingStatus(true);
            setStatus(status);

            // Send request
            const resp = await patchData(
                ApiEndpoints.REVIEW_STATUS + `/${selectedReview?._id}`,
                {
                    userId: selectedReview?.user._id,
                    week: selectedReview?.week,
                    status: status,
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update selected review
                setSelectedReview((prevReview: Review | null) => {
                    return prevReview
                        ? { ...prevReview, status: status as string }
                        : null;
                });

                // Update review list
                setReviews((reviews: Review[]) => {
                    return reviews.map((review) =>
                        review._id === selectedReview?._id
                            ? { ...review, status: status as string }
                            : { ...review }
                    );
                });

                setChangingStatus(false);

                toast({ title: "Status updated successfully." });
            }
        } catch (err: unknown) {
            setStatus(selectedReview?.status as string);
            setChangingStatus(false);
            handleCustomError(err);
        }
    };

    // Update feedback
    useEffect(() => {
        const updateFeedback = async () => {
            try {
                // Send request
                const resp = await patchData(
                    ApiEndpoints.REVIEW + `/${selectedReview?._id}`,
                    {
                        feedback: debouncedFeedback,
                    },
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    // Update selected review
                    setSelectedReview((prevReview: Review | null) =>
                        prevReview ? { ...prevReview, feedback: debouncedFeedback } : null
                    );

                    // Update the reviews list
                    setReviews((prevReviews: Review[]) => {
                        return prevReviews.map((review) =>
                            review._id === selectedReview?._id
                                ? { ...review, feedback: debouncedFeedback }
                                : { ...review }
                        );
                    });
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        selectedReview && updateFeedback();
    }, [debouncedFeedback]);

    return (
        <AnimatePresence mode="wait">
            {selectedReview && (
                <div
                    className="h-full p-5 rounded-2xl overflow-hidden border border-border
                dark:bg-background shadow-sm"
                >
                    <div key={selectedReview._id} className="space-y-5">
                        {/* Heading */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedReview.week[0].toUpperCase() +
                                        selectedReview.week.slice(1) +
                                        " " +
                                        `(${selectedReview.title[0].toUpperCase() +
                                        selectedReview.title.slice(1)
                                        })`}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role badge */}
                                <Badge
                                    className={cn(
                                        "text-sm font-semibold rounded-full duration-0",
                                        selectedReview.result === "Pass"
                                            ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                            : selectedReview.result === "Fail"
                                                ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                    )}
                                >
                                    {selectedReview.result || "Pending"}
                                </Badge>

                                {/* Update review sheet */}
                                <UpdateReviewsheet
                                    button={
                                        <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                            <Edit2 className="h-4 w-4" />
                                        </div>
                                    }
                                    selectedReview={selectedReview}
                                    setSelectedReview={setSelectedReview}
                                    setReviews={setReviews}
                                />
                            </div>
                        </div>

                        {/* Instructor section */}
                        <div className="flex flex-col gap-5">
                            {/* Name */}
                            <UserNameCard
                                data={{
                                    name: selectedReview.user.name,
                                    email: selectedReview.user.email,
                                    role: selectedReview.user.role,
                                    profilePic: selectedReview.user.profilePic || "",
                                }}
                            />

                            {/* Feedback */}
                            <motion.div
                                key={selectedReview._id}
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
                                    value={feedback}
                                    onChange={(event) => setFeedback(event.target.value)}
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
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <motion.div
                                        initial={{ opacity: 1, x: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0 }}
                                    >
                                        <InfoCard
                                            Icon={CircleDashed}
                                            label="Status"
                                            text={selectedReview.status}
                                            iconDivClassName="bg-yellow-400/20 group-hover:bg-yellow-400/30"
                                            iconClassName="text-yellow-600"
                                        />
                                    </motion.div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                                    {["Absent", "Pending", "Completed", "Cancelled"].map(
                                        (item, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    updateStatus(item);
                                                }}
                                                className="relative"
                                            >
                                                {status === item && changingStatus && (
                                                    <Loader2 className="w-4 h-5 text-foreground animate-spin" />
                                                )}
                                                {status === item && changingStatus
                                                    ? "Processing"
                                                    : item}

                                                {selectedReview.status === item && (
                                                    <Check className="absolute right-2 w-4 h-4 text-foreground" />
                                                )}
                                            </DropdownMenuItem>
                                        )
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Score */}
                            <motion.div
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0 }}
                            >
                                <div className="group min-w-[250px] p-3 rounded-lg border border-border bg-background shadow-sm">
                                    <div className="relative flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-red-400/20 group-hover:bg-red-400/30">
                                            <Trophy className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="text-start">
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {"Score"}
                                            </p>
                                            <p className="text-foreground font-semibold">
                                                {selectedReview?.score?.practical +
                                                    selectedReview?.score?.theory || "NILL"}
                                            </p>
                                        </div>
                                        <AddMarkModal
                                            className="absolute top-1.5 right-1"
                                            selectedReview={selectedReview}
                                            setSelectedReview={setSelectedReview}
                                            setReviews={setReviews}
                                        />
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
                                    text={new Date(selectedReview.updatedAt).toLocaleDateString(
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
                                />
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
