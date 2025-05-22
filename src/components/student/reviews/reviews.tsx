import { ChangeEvent, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Ban,
    Calendar1,
    CalendarDays,
    CheckCircle,
    ChevronRight,
    CircleDashed,
    SearchIcon,
    X,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingsAndChart, ReviewDetails } from "./review-details";
import CardHeader from "@/components/common/data-toolbar/header";
import { IReview } from "@/types/IReview";
import { handleCustomError } from "@/utils/error";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import { IUserContext, UserContext } from "@/context/user-context";
import Search from "@/components/common/data-toolbar/search";

// Interface for Review

// Reviews Component
function Reviews() {
    // Review related states
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);

    const [fetching, setFetching] = useState<boolean>(true);

    // Search
    const [search, _setSearch] = useState<string>("");

    // Role
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.REVIEW + `?userId=${user?._id}`,
                    role
                );

                // Sucess response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update reviews
                    setTimeout(() => {
                        setReviews(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-5">
            {/* Reviews lists */}
            <div
                className="sticky top-0 bg-background dark:bg-sidebar-background w-full p-5 flex flex-col gap-5
            h-[calc(100vh-322px)] md:h-[calc(100vh-108px)] mb-5 md:mb-0 rounded-2xl
            border border-border shadow-sm"
            >
                {/* Card header */}
                <CardHeader count={reviews.length} heading="Reviews lists" />

                {/* Search filter sort */}
                <div className="w-full flex relative">
                    <Search
                        handleSearch={async (_event: ChangeEvent<HTMLInputElement>) => { }}
                        search={search}
                    />
                </div>

                {reviews.length > 0 && (
                    <div className="flex flex-col gap-3 overflow-auto no-scrollbar ">
                        {reviews.map((review, index) => (
                            <div key={review._id} className="relative rounded-lg">
                                {/* One list */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className={cn(
                                        "p-2 px-3 flex items-center gap-4 cursor-pointer rounded-full border dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark",
                                        selectedReview?._id === review._id
                                            ? "bg-muted dark:bg-sidebar"
                                            : ""
                                    )}
                                    onClick={() => setSelectedReview(review)}
                                >
                                    {/* Icon circle */}
                                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-background border-2 border-white dark:border-border shadow-md">
                                        {review.status === "Completed" ? (
                                            review.result === "Pass" ? (
                                                <CheckCircle size={24} className="text-green-700" />
                                            ) : review.result === "Fail" ? (
                                                <XCircle size={24} className="text-red-700" />
                                            ) : (
                                                <CircleDashed size={24} className="text-yellow-700" />
                                            )
                                        ) : review.status === "Pending" ? (
                                            <CircleDashed size={24} className="text-yellow-700" />
                                        ) : review.status === "Absent" ? (
                                            <X size={24} className="text-red-700" />
                                        ) : review.status === "Cancelled" ? (
                                            <Ban size={24} className="text-purple-700" />
                                        ) : (
                                            <CircleDashed size={24} className="text-yellow-700" />
                                        )}
                                    </div>

                                    {/* Week and date */}
                                    <div className="flex flex-col gap-1">
                                        <p className="text-foreground font-semibold">
                                            {review.week?.name || "Foundation"}
                                        </p>
                                        <div className="flex items-center gap-2 relative overflow-auto no-scrollbar">
                                            <p className="relative text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                <CalendarDays className="w-3 h-3" />
                                                {review.title}
                                            </p>
                                            <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium truncate">
                                                <Calendar1 className="w-3 h-3" />
                                                {new Date(review?.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="ml-auto w-4 h-4 text-foreground" />
                                </motion.div>

                                {/* Line */}
                                {index < reviews.length - 1 && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 28 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        style={{ top: "56px" }}
                                        className={cn(
                                            "absolute z-50 left-[37px] w-0.5 -translate-x-1/2 rounded-full",
                                            reviews[index + 1].status === "Pass"
                                                ? "bg-green-700"
                                                : "bg-red-700"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* If no reviews */}
                {reviews.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={CalendarDays}
                        SubIcon={fetching ? SearchIcon : CircleDashed}
                        message={
                            fetching ? "Please wait a moment" : "Schedule review for students"
                        }
                        text={fetching ? "Fetching..." : "No reviews found"}
                        className="w-full"
                    />
                )}
            </div>

            {/* Selected review details */}
            <div className="w-full h-full bg-background border-0 shadow-none md:bg-transparent relative z-20 rounded-2xl grid grid-rows-[auto_1fr] md:col-span-1 lg:col-span-2 gap-5 overflow-auto no-scrollbar">
                {/* Review details */}
                <ReviewDetails
                    selectedReview={selectedReview as IReview}
                    reviews={reviews}
                    fetching={fetching}
                />

                {/* Pendings and performance graph */}
                <PendingsAndChart
                    selectedReview={selectedReview as IReview}
                    reviews={reviews}
                    fetching={fetching}
                />
            </div>
        </div>
    );
}

export default Reviews;
