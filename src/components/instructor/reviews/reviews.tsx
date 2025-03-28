import { Calendar1, CalendarDays, Plus, SearchIcon } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
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
import { loadedReviews, loadReviews, socket } from "@/socket/instructorSocket";
import { IReview } from "@/types/review";

// Reviews Component
function Reviews() {
    // Review related states
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
    const [newReview, setNewReview] = useState<IReview | null>(null);

    const [fetching, setFetching] = useState<boolean>(true);

    // Search
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
    });

    // Filter
    const [filter, setFilter] = useState<string>("");

    // Date
    const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Div ref
    const divRef = useRef<HTMLDivElement>(null);

    // Handle search
    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Emmit Load reviews event when scroll to bottom - socket
    const handleScroll = () => {
        const divCurrent = divRef.current;

        if (divCurrent) {
            const isBottom =
                divCurrent.scrollHeight - divCurrent.scrollTop <=
                divCurrent.clientHeight + 1;

            if (isBottom) {
                // Disable scrolling
                divCurrent.style.overflow = "hidden";

                loadReviews(
                    debouncedSearch,
                    sort.key,
                    sort.order,
                    selectedDate?.toDateString() || "",
                    filter,
                    user?.batches?.map((b) => b._id) as string[],
                    reviews.length
                );
            }
        }
    };

    // Listen loaded reviews event when scroll to bottom - socket
    useEffect(() => {
        loadedReviews((data: IReview[]) => {
            setReviews((prevReviews) => [...prevReviews, ...data]);

            // Enable scrolling
            const divCurrent = divRef.current;

            if (divCurrent) {
                divCurrent.style.overflow = "auto";
            }
        });

        return () => {
            socket.off("loadedReviews");
        };
    }, []);

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
            setReviews((prevReviews: IReview[]) => {
                return [newReview, ...prevReviews];
            });
            setNewReview(null);
        }
    }, [newReview]);

    // Fetch reviews initially
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
                    }&batchIds=${user?.batches?.map((b) => b._id)}&skip=${0}`,
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
                // onClick={() => setDatePickerOpen(false)}
                className="p-5 sticky z-0 top-0 md:top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background dark:bg-sidebar-background border border-border shadow-sm"
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
                            setDatePickerOpen(!isDatePickerOpen);
                        }}
                        className="bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark cursor-pointer"
                    />
                    <DatePicker
                        isDatePickerOpen={isDatePickerOpen}
                        selectedDate={selectedDate}
                        setSelectedDate={(date) => {
                            setSelectedDate(date);
                            setTimeout(() => {
                                setDatePickerOpen(false);
                            }, 0);
                        }}
                        className="absolute z-20 bg-background top-[45.5px] border rounded-lg"
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
                        fitlerData={["", "Absent", "Pending", "Completed", "Cancelled"]}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>

                {/* Reviews lists */}
                {reviews.length > 0 && (
                    <div
                        ref={divRef}
                        onScroll={handleScroll}
                        className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar"
                    >
                        {reviews.map((review, index) => (
                            <UserList
                                key={review._id}
                                index={index}
                                user={{
                                    _id: review._id,
                                    name: review.user.name,
                                    profilePic: review.user.profilePic,
                                }}
                                action={() => setSelectedReview(review)}
                                selectedUser={selectedReview}
                                className="dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
                                children1={
                                    <div className="flex items-center relative overflow-auto no-scrollbar">
                                        <p className="relative text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                            <CalendarDays className="w-3 h-3" />{" "}
                                            {review.week[0].toUpperCase() + review.week.slice(1)}
                                        </p>
                                        <p className="flex gap-1 items-center absolute left-20 text-sm text-muted-foreground font-medium truncate">
                                            <Calendar1 className="w-3 h-3" />
                                            {new Date(review?.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                }
                                children2={
                                    <div className="flex items-center p-2 rounded-full">
                                        {(() => {
                                            switch (review.status) {
                                                case "Pending":
                                                    return (
                                                        <div className="p-1 rounded-full bg-yellow-400/40 group-hover:bg-yellow-400/50"></div>
                                                    );
                                                case "Cancelled":
                                                    return (
                                                        <div className="p-1 rounded-full bg-purple-400/40 group-hover:bg-purple-400/50"></div>
                                                    );
                                                case "Absent":
                                                    return (
                                                        <div className="p-1 rounded-full bg-red-400/40 group-hover:bg-red-400/50"></div>
                                                    );
                                                case "Completed":
                                                    return (
                                                        <div className="p-1 rounded-full bg-green-400/40 group-hover:bg-green-400/50"></div>
                                                    );

                                                default:
                                                    return null;
                                            }
                                        })()}
                                    </div>
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
                        className="w-full "
                    />
                )}
            </div>

            {/* Right side */}
            <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                {/* Review details */}
                <ReviewDetails
                    setReviews={setReviews}
                    selectedReview={selectedReview}
                    setSelectedReview={setSelectedReview}
                />
                <div className=""></div>
            </div>
        </div>
    );
}

export default Reviews;
