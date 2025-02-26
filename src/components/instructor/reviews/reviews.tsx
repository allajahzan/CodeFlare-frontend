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
    Filter,
    MoreHorizontal,
    Plus,
    Search,
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

// Interface for Review
export interface Review {
    _id: string;
    user: {
        userId: string;
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
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="search"
                            placeholder="Search"
                            autoComplete="off"
                            required
                            // value={search}
                            // onChange={handleSearch}
                            className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                        />
                    </div>

                    {/* Sort */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="flex items-center justify-center w-[41.6px] rounded-lg
                                    border hover:bg-muted dark:hover:bg-sidebar shadow-sm"
                        >
                            <SortAsc className="h-4 w-4 text-foreground" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <DropdownMenuLabel>Sort</DropdownMenuLabel>

                            {/* Checkbox for sorting order */}
                            <div className="flex items-center gap-2 py-1.5 pl-2 cursor-pointer">
                                <Checkbox
                                    checked={sort.order === 1}
                                    onCheckedChange={() => {
                                        setSort((prev) => ({
                                            ...prev,
                                            order: prev.order === 1 ? -1 : 1,
                                        }));
                                    }}
                                    id="ascending"
                                    className="border-border"
                                />
                                <label
                                    htmlFor="ascending"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Ascending
                                </label>
                            </div>

                            <DropdownMenuSeparator />

                            {/* Sorting options */}
                            <DropdownMenuItem
                                textValue="name"
                                onClick={() =>
                                    setSort((prev) =>
                                        prev.key !== "name"
                                            ? { key: "name", order: prev.order }
                                            : prev
                                    )
                                }
                                onSelect={(e) => e.preventDefault()}
                                className="flex justify-between"
                            >
                                <span>Name</span>
                                <span>
                                    {sort.key === "name" && (
                                        <Check className="w-4 h-4 text-foreground" />
                                    )}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                textValue="createdAt"
                                onClick={() =>
                                    setSort((prev) =>
                                        prev.key !== "createdAt"
                                            ? { key: "createdAt", order: prev.order }
                                            : prev
                                    )
                                }
                                onSelect={(e) => e.preventDefault()}
                                className="flex justify-between"
                            >
                                <span>Date</span>
                                <span>
                                    {sort.key === "createdAt" && (
                                        <Check className="w-4 h-4 text-foreground" />
                                    )}
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Filter */}
                    <Select>
                        <SelectTrigger
                            className="w-[41.6px] h-[41.6px] flex justify-center p-0 py-5 
                                    hover:bg-muted dark:hover:bg-sidebar shadow-sm"
                        >
                            <Filter className="h-4 w-4 text-foreground" />
                        </SelectTrigger>
                        <SelectContent align={"end"}>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="placement">Ongoing</SelectItem>
                                <SelectItem value="ongoing">Completed</SelectItem>
                                <SelectItem value="held">Pending</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
                        SubIcon={fetching ? Search : Plus}
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
