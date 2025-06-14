import NotSelected from "@/components/common/fallback/not-selected";
import InfoCard from "@/components/common/other-card/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
import { Fragment, useContext, useLayoutEffect, useRef, useState } from "react";
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
import { IReview } from "@/types/IReview";

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

    // Reset feedback
    useLayoutEffect(() => {
        setFeedback(selectedReview?.feedback || "");
    }, [selectedReview?._id]);

    // Update feedback
    const updateFeedback = async (updatedFeedback: string) => {
        setFeedback(updatedFeedback);

        if (
            selectedReview?.feedback?.toLowerCase() === updatedFeedback.toLowerCase()
        ) {
            return;
        }

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
                    feedback: updatedFeedback,
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update selected review
                setSelectedReview((prevReview: IReview | null) =>
                    prevReview ? { ...prevReview, feedback: updatedFeedback } : null
                );

                // Update the reviews list
                setReviews((prevReviews: IReview[]) => {
                    return prevReviews.map((review) =>
                        review._id === selectedReview?._id
                            ? { ...review, feedback: updatedFeedback }
                            : { ...review }
                    );
                });
            }
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

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
                const data = resp.data?.data;

                // Update selected review
                setSelectedReview((prevReview: IReview | null) => {
                    return prevReview
                        ? {
                            ...prevReview,
                            status,
                            ...(status !== "Completed" && {
                                score: null,
                                result: null,
                                pendings: [],
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
                                    pendings: [],
                                }),
                            }
                            : { ...review }
                    );
                });

                // If status is not completed - Delete newly scheduled, next review of the student
                if (status !== "Completed" && data?._id) {
                    setReviews((prevReviews: IReview[]) => {
                        return prevReviews.filter((review) => review._id !== data._id);
                    });
                }

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
    useLayoutEffect(() => {
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
        <Fragment>
            {selectedReview && (
                <div
                    className={
                        "realtive h-fit p-5 rounded-2xl overflow-hidden border border-border bg-background dark:bg-sidebar-background shadow-sm"
                    }
                >
                    {/* Overlay to restrict action */}
                    {selectedReview.instructor._id !== user?._id && (
                        <div className="absolute z-50 inset-0 top-0 left-0 cursor-not-allowed bg-white/30 dark:bg-black/50"></div>
                    )}

                    <div key={selectedReview._id} className="space-y-5 h-full">
                        {/* Heading */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedReview.category === "Weekly" ||
                                        selectedReview.category === "Foundation"
                                        ? `${selectedReview.week.name
                                        } (${selectedReview.title[0].toUpperCase()}${selectedReview.title.slice(
                                            1
                                        )})`
                                        : selectedReview.category}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role badge - Nor for normal review*/}
                                {selectedReview.category !== "Normal" && (
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
                                )}

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
                                    name: selectedReview.student.name,
                                    email: selectedReview.student.email,
                                    role: selectedReview.student.role,
                                    profilePic: selectedReview.student.profilePic || "",
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
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => updateFeedback(e.target.value)}
                                    autoComplete="off"
                                    className="border-none shadow-none p-3 py-[22.9px] text-foreground dark:bg-sidebar"
                                    placeholder="Enter your feedback for this student"
                                />
                            </motion.div>
                        </div>

                        {/* Info cards */}
                        <div
                            ref={cardsListsRef}
                            onWheel={onwheel}
                            className="flex gap-[13px] relative w-full overflow-scroll no-scrollbar"
                        >
                            {/* Status */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-${statusColor}-50 to-${statusColor}-100 dark:from-${statusColor}-900/20 dark:to-${statusColor}-800/20 border border-${statusColor}-200 dark:border-${statusColor}-800`}
                                    >
                                        <div
                                            className={`absolute z-10 top-0 right-0 w-16 h-16 bg-${statusColor}-200 dark:bg-${statusColor}-700/20 rounded-bl-full opacity-50`}
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
                                    {["Pending", "Cancelled", "Absent", "Completed"].map(
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

                            {/* Score - Not for normal review*/}
                            {selectedReview.category !== "Normal" && (
                                <div>
                                    <div className="relative overflow-hidden group min-w-[250px] p-3 rounded-lg shadow-sm bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 ">
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
                            )}

                            {/* Sheduled date */}
                            <div className="relative overflow-hidden group min-w-[250px] rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-700/20 rounded-bl-full opacity-50" />
                                <InfoCard
                                    Icon={CalendarDays}
                                    label="Scheduled Date"
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
                                    className="w-full"
                                />
                            </div>

                            {/* Review date */}
                            <div className="relative overflow-hidden group min-w-[250px] rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 dark:bg-orange-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={CalendarDays}
                                    label="Reveiw Date"
                                    text={
                                        selectedReview?.date
                                            ? new Date(selectedReview.date).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "--/--/--"
                                    }
                                    iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                                    iconClassName="text-orange-600"
                                />
                            </div>

                            {/* Time */}
                            <div className="relative overflow-hidden group min-w-[250px] rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={Clock}
                                    label="Time"
                                    text={
                                        selectedReview.time
                                            ? convertTo12HourFormat(selectedReview.time)
                                            : "--:--"
                                    }
                                    iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                                    iconClassName="text-green-600"
                                />
                            </div>

                            {/* Duration */}
                            <div className="relative overflow-hidden group min-w-[250px] rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-700/20 rounded-bl-full opacity-50"></div>
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
                    Icon={CalendarDays}
                    message={`Select a review from the list to view their details`}
                    text={`No review selected`}
                    className="h-[313.95px]"
                />
            )}
        </Fragment>
    );
}

export default ReviewDetails;
