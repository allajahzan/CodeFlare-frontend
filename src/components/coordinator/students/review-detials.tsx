import {
    CircleDashed,
    Clock,
    Trophy,
    SearchIcon,
    X,
    User2,
    Ban,
    Check,
    CheckCheck,
    Info,
    CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CardHeader from "@/components/common/data-toolbar/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { useEffect, useState } from "react";
import Filter from "@/components/common/data-toolbar/filter";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IWeek } from "@codeflare/common";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { IReview } from "@/types/IReview";
import { IStudent } from "@/types/IStudent";
import { convertTo12HourFormat } from "@/utils/time-converter";
import NotSelected from "@/components/common/fallback/not-selected";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "@/components/common/tooltip/tooltip";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import { motion } from "framer-motion";

// Interface for props
interface PropsTypes {
    selectedStudent: IStudent | null;
}

export default function ReviewDetails({ selectedStudent }: PropsTypes) {
    // Reviews
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [fetching, setFetching] = useState<boolean>(false);

    // week
    const [weeks, setWeeks] = useState<IWeek[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<IWeek | null>(null);

    // Filter
    const [filter, setFilter] = useState<string>("");
    const [result, setResult] = useState<string>("");

    // Role
    const role = useSelector((state: stateType) => state.role);

    // Fetch weeks
    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.WEEK_SEARCH, role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update weeks
                    setWeeks(data);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        fetchWeeks();
    }, []);

    // Clear result when select status
    useEffect(() => {
        setResult("");
    }, [filter]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setReviews([]);
            setFetching(true);

            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.REVIEW +
                    `?studentId=${selectedStudent?._id}&weekId=${selectedWeek?._id || ""
                    }&status=${filter}&result=${result}`,
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
    }, [selectedStudent?._id, selectedWeek, filter, result]);

    return (
        <>
            {selectedStudent && (
                <div className="h-[620px] flex flex-col gap-5 p-5 rounded-2xl bg-background dark:bg-sidebar-background border shadow-sm overflow-hidden">
                    <CardHeader
                        heading="Review details"
                        children={
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <ToolTip
                                        text="Icon Info"
                                        side="top"
                                        children={
                                            <div className="bg-muted dark:bg-zinc-900 dark:hover:bg-muted text-foreground rounded-full p-2">
                                                <Info className="h-4 w-4" />
                                            </div>
                                        }
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Icon Info</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <X size={10} className="text-red-600" />
                                        Absent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CircleDashed size={10} className="text-yellow-600" />
                                        Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Ban size={10} className="text-purple-600" />
                                        Cancelled
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Check size={10} className="text-green-600" />
                                        Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CheckCheck size={10} className="text-green-600" />
                                        Pass
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CheckCheck size={10} className="text-red-600" />
                                        Fail
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        }
                    />

                    <div className="w-full flex gap-2 relative">
                        {/* Week */}
                        <Select
                            value={selectedWeek ? JSON.stringify(selectedWeek) : ""}
                            onValueChange={(value) => {
                                setSelectedWeek(JSON.parse(value));
                                setFilter("");
                                setResult("");
                            }}
                        >
                            <div className="relative w-full text-foreground">
                                <SelectTrigger className="p-5 pl-9 pr-3">
                                    <SelectValue placeholder="Select week" />
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </SelectTrigger>
                                {selectedWeek && (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedWeek(null);
                                            setFilter("");
                                            setResult("");
                                        }}
                                        className="absolute z-10 p-2 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-foreground" />
                                    </div>
                                )}
                            </div>
                            <SelectContent className="max-h-[200px]">
                                {weeks.length > 0 &&
                                    weeks.map((week: IWeek) => {
                                        return (
                                            <SelectItem key={week._id} value={JSON.stringify(week)}>
                                                {week.name}
                                            </SelectItem>
                                        );
                                    })}
                                {weeks.length === 0 && (
                                    <p className="text-foreground font-medium text-sm">
                                        No weeks are added yet
                                    </p>
                                )}
                            </SelectContent>
                        </Select>

                        {/* Status */}
                        <Filter
                            filter={filter}
                            setFilter={setFilter}
                            title="Status"
                            filterData={["", "Pending", "Cancelled", "Absent", "Completed"]}
                        />

                        {/* Result */}
                        <Filter
                            Icon={Trophy}
                            filter={result}
                            setFilter={setResult}
                            title="Result"
                            filterData={["", "Pass", "Fail"]}
                        />
                    </div>

                    <div className="h-full overflow-auto no-scrollbar">
                        <div className="flex flex-col gap-3 items-start space-x-0 h-full">
                            {reviews.length > 0 &&
                                reviews.map((review, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        key={index}
                                        className="flex h-fit w-full"
                                    >
                                        {/* Week Card */}
                                        <Card className="group relative w-full bg-background dark:bg-sidebar border dark:border-transparent transition-shadow duration-300 overflow-hidden shadow-none">
                                            <div className="text-foreground p-5 pb-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base font-semibold">
                                                            {review.week.name}
                                                        </CardTitle>
                                                    </div>

                                                    {/* Status Icon */}
                                                    {review.status === "Completed" ? (
                                                        review.result === "Pass" ? (
                                                            <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-green-400/20 group-hover:bg-green-400/30 rounded-bl-full">
                                                                <CheckCheck
                                                                    size={20}
                                                                    className="text-green-600"
                                                                />
                                                            </div>
                                                        ) : review.result === "Fail" ? (
                                                            <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-red-400/20 group-hover:bg-red-400/30 rounded-bl-full">
                                                                <CheckCheck
                                                                    size={20}
                                                                    className="text-red-600"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-green-400/20 group-hover:bg-green-400/30 rounded-bl-full">
                                                                <Check size={20} className="text-green-600" />
                                                            </div>
                                                        )
                                                    ) : review.status === "Pending" ? (
                                                        <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-yellow-400/20 group-hover:bg-yellow-400/30 rounded-bl-full">
                                                            <CircleDashed
                                                                size={20}
                                                                className="text-yellow-600"
                                                            />
                                                        </div>
                                                    ) : review.status === "Absent" ? (
                                                        <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-red-400/20 group-hover:bg-red-400/30 rounded-bl-full">
                                                            <X size={20} className="text-red-600" />
                                                        </div>
                                                    ) : review.status === "Cancelled" ? (
                                                        <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-purple-400/20 group-hover:bg-purple-400/30 rounded-bl-full">
                                                            <Ban size={20} className="text-purple-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-5 pr-3 pt-3 absolute top-0 right-0 bg-yellow-400/20 group-hover:bg-yellow-400/30 rounded-bl-full">
                                                            <CircleDashed
                                                                size={20}
                                                                className="text-yellow-600"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-sm font-semibold mt-1">
                                                    {review.title}
                                                </h3>
                                            </div>

                                            <CardContent className="p-5">
                                                <div className="space-y-4">
                                                    {/* Status Badge and score */}
                                                    {review.category !== "Normal" && (
                                                        <div className="flex items-center justify-between">
                                                            <Badge
                                                                className={cn(
                                                                    "text-sm font-semibold rounded-full duration-0",
                                                                    review.result === "Pass"
                                                                        ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                                                        : review.result === "Fail"
                                                                            ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                                                            : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                                                )}
                                                            >
                                                                {review.result || "Pending"}
                                                            </Badge>

                                                            <div className="flex items-center space-x-1 text-foreground">
                                                                <Trophy className="w-4 h-4" />
                                                                <span className="text-sm font-medium">
                                                                    {review.score?.practical
                                                                        ? review.score?.theory +
                                                                        review.score?.practical +
                                                                        "/20"
                                                                        : "NILL"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reviewer Details */}
                                                    <div className="">
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar className="bg-background w-14 h-14 border-4 border-background dark:border-border shadow-md">
                                                                <AvatarImage
                                                                    src={review.instructor.profilePic}
                                                                    className="object-cover"
                                                                />
                                                                <AvatarFallback className="bg-transparent">
                                                                    <img src={profile} alt="" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-base font-semibold text-foreground truncate">
                                                                        {review.instructor.name}
                                                                    </h4>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground font-medium truncate">
                                                                    {review.instructor.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Date and Time */}
                                                        <div className="flex items-center justify-between mt-3 text-foreground font-medium">
                                                            <p className="mt-1 text-sm flex items-center">
                                                                {/* <CalendarDays className="w-4 h-4 mr-1" /> */}
                                                                {review.status === "Completed"
                                                                    ? "Reviewed on "
                                                                    : new Date(
                                                                        new Date(review.date).setHours(
                                                                            Number(review.time.split(":")[0]),
                                                                            Number(review.time.split(":")[1]),
                                                                            0,
                                                                            0
                                                                        )
                                                                    ) < new Date()
                                                                        ? "Was to be reviewed on "
                                                                        : "Is to be reviewed on "}
                                                                {new Date(review.date).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                            <div className="flex items-center text-sm">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {review.time
                                                                    ? convertTo12HourFormat(review.time)
                                                                    : "Time didn't updated yet!"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feedback */}
                                                    {review.feedback && (
                                                        <div className="bg-muted dark:bg-sidebar-backgroundDark rounded-lg p-3 border-l-4 border-zinc-200 dark:border-muted">
                                                            <p className="text-foreground text-sm font-medium leading-relaxed italic">
                                                                "{review.feedback}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}

                            {/* If no reviews */}
                            {reviews.length === 0 && (
                                <NotFoundOrbit
                                    MainIcon={CalendarDays}
                                    SubIcon={fetching ? SearchIcon : Clock}
                                    message={
                                        fetching
                                            ? "Please wait a moment"
                                            : "Instructor has to schedule review"
                                    }
                                    text={fetching ? "Fetching..." : "No reviews found"}
                                    className="w-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* If no selected student */}
            {!selectedStudent && (
                <NotSelected
                    Icon={User2}
                    message={`Select a student from the list to view review details`}
                    text={`No student selected`}
                    className="h-full shadow-sm"
                />
            )}
        </>
    );
}
