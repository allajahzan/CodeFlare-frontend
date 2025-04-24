import { NotSelected } from "@/components/animation/fallbacks";
import InfoCard from "@/components/common/other-cards/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
    Ban,
    CalendarDays,
    Check,
    CircleCheckBig,
    CircleDashed,
    CircleX,
    Clock,
    Edit2,
    Hourglass,
    Loader2,
    LucideProps,
    Trophy,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
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
import { IUserContext, UserContext } from "@/context/user-context";
import { IReview } from "@/types/review";

// Interface for Props
interface PropsType {
    setReviews: React.Dispatch<React.SetStateAction<[] | IReview[]>>;
    setSelectedReview: React.Dispatch<React.SetStateAction<IReview | null>>;
    selectedReview: IReview | null;
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

    // Status related states
    const [status, setStatus] = useState<string>(selectedReview?.status || "");
    const [changingStatus, setChangingStatus] = useState<boolean>(false);
    const [statusColor, setStatusColor] = useState<string>("");
    const [statusIcon, setStatusIcon] =
        useState<
            React.ForwardRefExoticComponent<
                Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
            >
        >(CircleDashed);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Horizontal scroll
    let cardsListsRef = useRef<HTMLDivElement | null>(null);

    const onwheel = (event: any): void => {
        (cardsListsRef.current as HTMLDivElement).scrollLeft += event.deltaY;
    };

    // useEffect(() => {
    //     cardsListsRef.current?.addEventListener("wheel", onwheel);
    // }, []);

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

    // Update feedback
    useEffect(() => {
        const updateFeedback = async () => {
            // Check if instructor is authorized
            if (selectedReview?.instructor._id !== user?._id) {
                toast({
                    title: "You are restricted to update this feedback !",
                });
                return;
            }

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
                    setSelectedReview((prevReview: IReview | null) =>
                        prevReview ? { ...prevReview, feedback: debouncedFeedback } : null
                    );

                    // Update the reviews list
                    setReviews((prevReviews: IReview[]) => {
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

        selectedReview &&
            selectedReview.feedback !== debouncedFeedback &&
            updateFeedback();
    }, [debouncedFeedback]);

    // Update status
    const updateStatus = async (status: string) => {
        try {
            // Check if instructor is authorized
            if (selectedReview?.instructor._id !== user?._id) {
                toast({
                    title: "You are restricted to update this status !",
                });
                return;
            }

            if (selectedReview?.status === status) return;

            setChangingStatus(true);
            setStatus(status);

            // Send request
            const resp = await patchData(
                ApiEndpoints.REVIEW_STATUS + `/${selectedReview?._id}`,
                {
                    status: status,
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update selected review
                setSelectedReview((prevReview: IReview | null) => {
                    return prevReview
                        ? {
                            ...prevReview,
                            status,
                            ...(status !== "Completed" && {
                                score: null,
                                result: null,
                            }),
                        }
                        : null;
                });

                // Update review list
                setReviews((reviews: IReview[]) => {
                    return reviews.map((review) =>
                        review._id === selectedReview?._id
                            ? {
                                ...review,
                                status,
                                ...(status !== "Completed" && {
                                    score: null,
                                    result: null,
                                }),
                            }
                            : { ...review }
                    );
                });

                setChangingStatus(false);

                toast({ title: `Status updated as ${status.toLowerCase()}.` });
            }
        } catch (err: unknown) {
            setStatus(selectedReview?.status as string);
            setChangingStatus(false);
            handleCustomError(err);
        }
    };

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
    }, [selectedReview?.status]);

    return (
        <AnimatePresence mode="wait">
            {selectedReview && (
                <div
                    className={
                        "realtive h-full p-5 rounded-2xl overflow-hidden border border-border bg-background dark:bg-sidebar-background shadow-sm"
                    }
                >
                    {/* Overlay to restrict action */}
                    {selectedReview.instructor._id !== user?._id && (
                        <div className="absolute z-50 inset-0 top-0 left-0 cursor-not-allowed bg-white/30 dark:bg-black/50"></div>
                    )}

                    <div key={selectedReview._id} className="space-y-5">
                        {/* Heading */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedReview.week[0].toUpperCase() +
                                        selectedReview.week.slice(1) +
                                        " " +
                                        `(${selectedReview.title.toUpperCase()})`}
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
                            onWheel={onwheel}
                            className="flex gap-[13px] relative -top-1 w-full overflow-scroll overflow-y-hidden no-scrollbar whitespace-nowrap scrollbar-hide"
                        >
                            {/* Status */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        className={`relative rounded-lg bg-gradient-to-br from-${statusColor}-50 to-${statusColor}-100 dark:from-${statusColor}-900/20 dark:to-${statusColor}-800/20 border border-${statusColor}-200 dark:border-${statusColor}-800`}
                                    >
                                        <div
                                            className={`absolute top-0 right-0 w-16 h-16 bg-${statusColor}-200 dark:bg-${statusColor}-700/20 rounded-bl-full opacity-50`}
                                        ></div>
                                        <InfoCard
                                            Icon={statusIcon}
                                            label="Status"
                                            text={selectedReview.status}
                                            iconDivClassName={`bg-${statusColor}-400/20 group-hover:bg-${statusColor}-400/30`}
                                            iconClassName={`text-${statusColor}-600`}
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                                    {["Absent", "Pending", "Cancelled", "Completed"].map(
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
                            <div>
                                <div className="relative group min-w-[250px] p-3 rounded-lg shadow-sm bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 ">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200 dark:bg-pink-700/20 rounded-bl-full opacity-50"></div>
                                    <div className="relative flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-pink-400/20 group-hover:bg-pink-400/30">
                                            <Trophy className="w-5 h-5 text-pink-600" />
                                        </div>

                                        <div className="text-start w-full">
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Score
                                            </p>
                                            {selectedReview.score ? (
                                                <div className="flex-1 flex items-center gap-2">
                                                    <p className="text-foreground font-semibold">
                                                        Practical :
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

                                        <AddMarkModal
                                            className="absolute -top-3 -right-3"
                                            selectedReview={selectedReview}
                                            setSelectedReview={setSelectedReview}
                                            setReviews={setReviews}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheduled date */}
                            <div className="relative rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-700/20 rounded-bl-full opacity-50"></div>
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
                            </div>

                            {/* Review date */}
                            <div className="relative rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 dark:bg-orange-700/20 rounded-bl-full opacity-50"></div>
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
                            </div>

                            {/* Time */}
                            <div className="relative rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={Clock}
                                    label="Time"
                                    text={convertTo12HourFormat(selectedReview.time)}
                                    iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                                    iconClassName="text-green-600"
                                />
                            </div>

                            {/* Duration */}
                            <div className="relative rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={Hourglass}
                                    label="Duration"
                                    text={"1 Hour"}
                                    iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                                    iconClassName="text-purple-600"
                                />
                            </div>
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
