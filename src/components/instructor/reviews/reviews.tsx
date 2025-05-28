import {
    Calendar1,
    CalendarDays,
    Info,
    Plus,
    Search,
    SearchIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReviewDetails from "./review-details";
import CardHeader from "@/components/common/data-toolbar/header";
import ScheduleReviewSheet from "./sheet-schedule-review";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import { handleCustomError } from "@/utils/error";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Sort from "@/components/common/data-toolbar/sort";
import Filter from "@/components/common/data-toolbar/filter";
import UserListCard from "@/components/common/user/user-list-card";
import IconButton from "@/components/ui/icon-button";
import DatePicker from "./date-picker";
import { IReview } from "@/types/IReview";
import FilterBatchStudent from "./filter-batch-student";
import { IBatch } from "@codeflare/common";
import { IStudent } from "@/types/IStudent";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import ToolTip from "@/components/common/tooltip/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Reviews Component
function Reviews() {
    // Review related states
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
    const [newReview, setNewReview] = useState<IReview | null>(null);

    const [fetching, setFetching] = useState<boolean>(true);

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
    });

    // Filter
    const [filter, setFilter] = useState<string>("");

    // Filter batch and students
    const [students, setStudents] = useState<[] | IStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | "">("");
    const [batches, setBatches] = useState<IBatch[] | []>([]);
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);
    const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);

    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Div ref
    const divRef = useRef<HTMLDivElement>(null);

    // Fetch batch
    useEffect(() => {
        const fetchBatch = async () => {
            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.BATCH + "?type=list", role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    setBatches(data);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        fetchBatch();
    }, []);

    // Fetch students based on batch - when batch selected
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetchingStudents(true);
                setStudents([]);
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?roleWise=student&batchId=${selectedBatch?._id}`,
                    role
                );

                if (resp?.status === 200) {
                    setStudents(resp.data.data); // Update students list
                }
            } catch (err) {
                handleCustomError(err);
            } finally {
                setFetchingStudents(false); // Always set fetching to false after request
            }
        };

        if (selectedBatch) fetchUsers();
    }, [selectedBatch]);

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
                    `/search?batchId=${selectedBatch?._id || ""
                    }&studentId=${selectedStudent}&domainId=${""}&weekId=${""}&sort=${sort.key
                    }&order=${sort.order}&status=${filter}&date=${selectedDate?.toDateString() || ""
                    }&category=${""}&skip=${0}`,
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
    }, [sort, filter, selectedDate, selectedBatch, selectedStudent]);

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
                        <div className="flex items-center gap-2">
                            {/* Review status info */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <ToolTip
                                        text="Color Info"
                                        side="top"
                                        children={
                                            <div className="bg-muted dark:bg-zinc-900 dark:hover:bg-muted text-foreground rounded-full p-2">
                                                <Info className="h-4 w-4" />
                                            </div>
                                        }
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Color Info</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <div className="p-1 rounded-full bg-red-400/40 group-hover:bg-red-400/50"></div>
                                        Absent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div className="p-1 rounded-full bg-yellow-400/40 group-hover:bg-yellow-400/50"></div>
                                        Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div className="p-1 rounded-full bg-purple-400/40 group-hover:bg-purple-400/50"></div>
                                        Cancelled
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div className="p-1 rounded-full bg-green-400/40 group-hover:bg-green-400/50"></div>
                                        Completed
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Add review sheet */}
                            <ScheduleReviewSheet
                                button={
                                    <ToolTip
                                        text="Add Review"
                                        children={
                                            <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                                <Plus className="h-4 w-4" />
                                            </div>
                                        }
                                    />
                                }
                                setNewReview={setNewReview}
                            />
                        </div>
                    }
                />

                {/* Search sort filter */}
                <div className="w-full flex gap-2 relative">
                    {/* Search reviews */}
                    <Select>
                        <SelectTrigger className="h-[41.6px] bg-background dark:hover:border-customBorder-dark dark:hover:bg-sidebar rounded-lg shadow-none cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <Input id="search" placeholder="Batch and student" className="border-none shadow-none p-0 cursor-pointer"/>
                            </div>
                        </SelectTrigger>

                        <SelectContent className="w-[220px]" align="end">
                            <FilterBatchStudent
                                batches={batches}
                                selectedBatch={selectedBatch}
                                setSelectedBatch={setSelectedBatch}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                students={students}
                                setStudents={setStudents}
                                fetchingStudents={fetchingStudents}
                            />
                        </SelectContent>
                    </Select>

                    {/* Calendar */}
                    <Select>
                        <SelectTrigger className="w-fit border-none h-fit p-0">
                            <ToolTip
                                text="Calendar"
                                side="top"
                                children={<IconButton Icon={CalendarDays} />}
                            />
                        </SelectTrigger>
                        <SelectContent align="end" className="p-0 shadow">
                            <DatePicker
                                selectedDate={selectedDate}
                                setSelectedDate={(date) => {
                                    setSelectedDate(date);
                                }}
                                className="shadow-none"
                            />
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Sort
                        sort={sort}
                        setSort={setSort}
                        sortData={["name", "createdAt"]}
                    />

                    {/* Filter */}
                    <Filter
                        title="Status"
                        filterData={["", "Absent", "Pending", "Completed", "Cancelled"]}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>

                {/* Reviews lists */}
                {reviews.length > 0 && (
                    <div
                        ref={divRef}
                        // onScroll={handleScroll}
                        className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar"
                    >
                        {reviews.map((review, index) => (
                            <UserListCard
                                key={review._id}
                                index={index}
                                user={{
                                    _id: review._id,
                                    name: review.student.name,
                                    profilePic: review.student.profilePic,
                                }}
                                action={() => setSelectedReview(review)}
                                selectedUser={selectedReview}
                                className="dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
                                children1={
                                    <div className="min-w-0 flex items-center gap-2 relative">
                                        <p className="relative text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                            <CalendarDays className="w-3 h-3" />
                                            {review.week?.name || "Foundation"}
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
            </div>
        </div>
    );
}

export default Reviews;
