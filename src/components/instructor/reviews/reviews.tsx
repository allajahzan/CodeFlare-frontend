import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    CalendarDays,
    CalendarIcon,
    Check,
    MoreHorizontal,
    Plus,
    SearchIcon,
    SortAsc,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import profile from "@/assets/images/no-profile.svg";
import ReviewDetails from "./review-details";
import CardHeader from "@/components/common/data-card/header";
import ScheduleReviewSheet from "./sheet-schedule-review";
import { IUserContext, UserContext } from "@/context/user-context";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import { handleCustomError } from "@/utils/error";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Sort from "@/components/common/data-card/sort";
import Filter from "@/components/common/data-card/filter";
import Search from "@/components/common/data-card/search";

// Interface for Review
export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
        profilePic?: string;
    };
    batchId: string;
    title: string;
    week: string;
    date: Date;
    time: string;
    rating: number;
    feedback: string;
    pendings: string[];
    score: {
        tech: number;
        theory: number;
    };
    status: string;
    result: string;
    createdAt: Date;
}

// Reviews Component
function Reviews() {
    // Review related states
    const [reviews, setReviews] = useState<Review[] | []>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [newReview, setNewReview] = useState<Review | null>(null);

    const [fetching, setFetching] = useState<boolean>(true);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: 1,
    });

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Add new review
    useEffect(() => {
        if (newReview) {
            setReviews((prevReviews: Review[]) => {
                return [...prevReviews, newReview];
            });
            setNewReview(null);
        }
    }, [newReview]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.REVIEW + `?batchIds=${user?.batches?.map((b) => b._id)}`,
                    role
                );

                // Success response
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
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side */}
            <div
                className="p-5 sticky z-0 top-0 md:top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background border border-border shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Card header */}
                <CardHeader
                    heading="Schedule reviews"
                    count={reviews.length}
                    children={
                        <ScheduleReviewSheet
                            button={
                                <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                    <Plus className="h-4 w-4" />
                                </div>
                            }
                            setNewReview={setNewReview}
                            batches={(user as any).batches}
                        />
                    }
                />

                {/* Search sort filter */}
                <div className="w-full flex gap-2">
                    {/* Search reviews */}
                    <Search search={search} handleSearch={() => { }} />

                    {/* Sort */}
                    <Sort sort={sort} setSort={setSort} />

                    {/* Filter */}
                    <Filter
                        title="Status"
                        fitlerData={["All", "Ongoing", "Completed", "Pending"]}
                    />
                </div>

                {/* Reviews lists */}
                {reviews.length > 0 && (
                    <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                onClick={() => setSelectedReview(review)}
                                className="group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer 
                                border border-border hover:bg-muted dark:hover:bg-sidebar"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar profile pic */}
                                    <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                                        <AvatarImage
                                            src={review.user?.profilePic || profile}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent">
                                            <img className="w-full" src={profile} alt="" />
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Name and other details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-foreground truncate">
                                                {review.user?.name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                            <CalendarDays className="w-3 h-3" /> {review.week}
                                        </p>
                                    </div>

                                    {/* Menu */}
                                    {/* <MoreHorizontal className="w-4 h-4 text-foreground" /> */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {reviews.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={CalendarDays}
                        SubIcon={fetching ? SearchIcon : Plus}
                        message={
                            fetching ? "Please wait a moment" : "Schedule review for students"
                        }
                        text={fetching ? "Fetching..." : "No reviews found"}
                        className="w-full"
                    />
                )}
            </div>

            {/* Right side */}
            <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                {/* Student details */}
                <ReviewDetails selectedReview={selectedReview} />
                <div className=""></div>
            </div>
        </div>
    );
}

export default Reviews;
