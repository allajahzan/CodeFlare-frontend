import { CalendarCheck, CalendarDays, Plus, SearchIcon } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
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
import UserList from "@/components/common/user/user-list-card";
import IconButton from "@/components/ui/icon-button";
import DatePicker from "./date-picker";

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
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: 1,
    });

    // Filter
    const [filter, setFilter] = useState<string>("");

    // Date
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle search
    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

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
        setFetching(true);
        setReviews([]);

        const fetchReviews = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.REVIEW +
                    `/search?keyword=${debouncedSearch}&sort=${sort.key}&order=${sort.order
                    }&status=${filter}&date=${selectedDate?.toDateString() || ""
                    }&batchIds=${user?.batches?.map((b) => b._id)}`,
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
    }, [debouncedSearch, sort, filter, selectedDate]);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side */}
            <div
                // onClick={() => setIsOpen(false)}
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
                <div className="w-full flex gap-2 relative">
                    {/* Search reviews */}
                    <Search search={search} handleSearch={handleSearch} />

                    {/* Filter by date */}
                    <IconButton
                        Icon={CalendarDays}
                        action={() => {
                            // e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                    />
                    <DatePicker
                        isOpen={isOpen}
                        selectedDate={selectedDate}
                        setSelectedDate={(date) => {
                            setSelectedDate(date);
                            setTimeout(() => {
                                setIsOpen(false);
                            }, 0);
                        }}
                        className="absolute z-20 bg-background top-[45.5px]"
                    />

                    {/* Sort */}
                    <Sort
                        sort={sort}
                        setSort={setSort}
                        sortData={["name", "week", "createdAt"]}
                    />

                    {/* Filter */}
                    <Filter
                        title="Status"
                        fitlerData={["", "Ongoing", "Completed", "Pending"]}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>

                {/* Reviews lists */}
                {reviews.length > 0 && (
                    <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                        {reviews.map((review, index) => (
                            <UserList
                                key={index}
                                index={index}
                                user={{
                                    _id: review._id,
                                    name: review.user.name,
                                    profilePic: review.user.profilePic,
                                }}
                                action={() => setSelectedReview(review)}
                                selectedUser={selectedReview}
                                children1={
                                    <p className="relative text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                        <CalendarDays className="w-3 h-3" /> {review.week}
                                        <span className="flex gap-1 items-center absolute left-20">
                                            {" "}
                                            <CalendarCheck className="w-3 h-3" />
                                            {new Date(review?.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </p>
                                }
                            />
                        ))}
                    </div>
                )}

                {/* If no reviews */}
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
                {/* Review details */}
                <ReviewDetails selectedReview={selectedReview} />
                <div className=""></div>
            </div>
        </div>
    );
}

export default Reviews;
