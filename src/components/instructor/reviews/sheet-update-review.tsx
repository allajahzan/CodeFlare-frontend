import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ValidationError from "@/components/ui/validation-error";
import { motion } from "framer-motion";
import {
    CalendarCheck2,
    CalendarDays,
    CalendarRange,
    Clock,
    FolderPen,
    ListFilter,
    Loader2,
} from "lucide-react";
import { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import DatePicker from "./date-picker";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/instructor/update-review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ApiEndpoints from "@/constants/api-endpoints";
import { patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { toast } from "@/hooks/use-toast";
import { IUserContext, UserContext } from "@/context/user-context";
import { IReview } from "@/types/IReview";
import { IReveiewCategory } from "@codeflare/common";

// Interface for Props
interface PropsType {
    button: ReactNode;
    selectedReview: IReview;
    setSelectedReview: React.Dispatch<React.SetStateAction<IReview | null>>;
    setReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
}

// Update review sheet
function UpdateReviewsheet({
    button,
    selectedReview,
    setSelectedReview,
    setReviews,
}: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Time
    const [selectedTime, setselectedTime] = useState<string>("");

    // Category
    const [category, setCategory] = useState<IReveiewCategory | null>(null);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Form validation
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // OnSubmit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        // Check if instructor is authorized
        if (selectedReview?.instructor._id !== user?._id) {
            toast({
                title: "You are restricted to update this review !",
            });
            setSubmiting(false);
            return;
        }

        setSubmiting(true);

        try {
            // Send request
            const resp = await patchData(
                ApiEndpoints.REVIEW + `/${selectedReview?._id}`,
                {
                    category: formData.category,
                    time: formData.time,
                    date: formData.date,
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                // Update selected review
                setSelectedReview((prevReview: IReview | null) =>
                    prevReview
                        ? {
                            ...prevReview,
                            category: data.category,
                            time: data.time,
                            date: data.date,
                            updatedAt: data.updatedAt,
                        }
                        : null
                );

                // Update the reviews list
                setReviews((prevReviews: IReview[]) => {
                    return prevReviews.map((review) =>
                        review._id === selectedReview?._id
                            ? {
                                ...review,
                                category: data.category,
                                time: data.time,
                                date: data.date,
                                updatedAt: data.updatedAt,
                            }
                            : { ...review }
                    );
                });

                toast({ title: "Review updated successfully !" });

                setSubmiting(false);
                setOpen(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Reset form fields
    useEffect(() => {
        reset({
            category: selectedReview.category,
            week: selectedReview.week?.name || "",
            title: selectedReview.title,
            date: selectedReview.date ? new Date(selectedReview.date) : "",
            time: selectedReview.time ? selectedReview.time : "",
        });

        setCategory(selectedReview.category);
        setSelectedDate(new Date(selectedReview.date));
        setselectedTime(selectedReview.time);
        setSubmiting(false);
    }, [open, reset, selectedReview]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
                {/* Header */}
                <SheetHeader className="p-5 bg-zinc-0">
                    <SheetTitle className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-muted rounded-full">
                            <CalendarCheck2 className="w-4 h-4" />
                        </div>
                        <span>Update review</span>
                    </SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                        Fill in the information below to update a review.
                    </SheetDescription>
                </SheetHeader>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onSubmit={handleSubmit(OnSubmit)}
                    className="h-full space-y-3 p-5 overflow-auto"
                >
                    {/* Select for category */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="category"
                            className="text-sm text-foreground font-medium"
                        >
                            Review Category
                        </Label>
                        <div className="relative">
                            <Select
                                key={"category"}
                                name="category"
                                required
                                defaultValue={category || ""}
                                onValueChange={(value) => {
                                    setValue("category", value);
                                }}
                            >
                                <SelectTrigger
                                    id="category"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder="Select review category"
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {["Foundation", "Weekly", "QA", "InTake"].map(
                                        (cate, index) => (
                                            <SelectItem key={index} value={cate}>
                                                {cate}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <ListFilter className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input for Week */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="week"
                            className="text-sm text-foreground font-medium"
                        >
                            Week
                        </Label>
                        <div className="relative">
                            <Input
                                id="week"
                                placeholder="Week"
                                required
                                disabled
                                autoComplete="off"
                                {...register("week")}
                                className="text-foreground font-medium p-5 pl-9"
                            />

                            <CalendarRange className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input for title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="title"
                            className="text-sm text-foreground font-medium"
                        >
                            Title
                        </Label>
                        <div className="relative">
                            <Input
                                id="title"
                                placeholder="Enter title"
                                required
                                disabled
                                autoComplete="off"
                                {...register("title")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <FolderPen className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Title error message */}
                        <ValidationError message={errors.title?.message as string} />
                    </motion.div>

                    {/* Date picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="date"
                            className="text-sm text-foreground font-medium"
                        >
                            Date
                        </Label>
                        <Select key={"date"} name="date">
                            <SelectTrigger
                                id="date"
                                className="h-[41.6px] bg-background dark:hover:border-customBorder-dark dark:hover:bg-sidebar rounded-lg shadow-none"
                            >
                                <div className="w-full flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <p className="text-foreground mt-0.5 truncate">
                                        {selectedDate
                                            ? selectedDate.toDateString()
                                            : "Select a date"}
                                    </p>
                                </div>
                            </SelectTrigger>
                            <SelectContent
                                align="end"
                                className="border-none shadow-none bg-transparent"
                            >
                                <DatePicker
                                    selectedDate={selectedDate}
                                    setSelectedDate={(date) => {
                                        setValue("date", date);
                                        setSelectedDate(date);
                                    }}
                                    className="w-fit bg-background dark:bg-sidebar-background border shadow rounded-lg"
                                />
                            </SelectContent>
                        </Select>

                        {/* Date error message */}
                        <ValidationError message={errors.date?.message as string} />
                    </motion.div>

                    {/* Time picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="time"
                            className="text-sm text-foreground font-medium"
                        >
                            Time
                        </Label>
                        <div className="relative">
                            <Select
                                key={"time"}
                                name="time"
                                onValueChange={(value) => {
                                    setselectedTime(value);
                                    setValue("time", value);
                                }}
                                defaultValue={selectedTime}
                            >
                                <SelectTrigger
                                    id="time"
                                    className="w-full p-3 pl-9 py-5 text-foreground"
                                >
                                    <SelectValue placeholder="Pick a time">
                                        {convertTo12HourFormat(selectedTime)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="h-[170px]">
                                    {Array.from({ length: 24 }, (_, hour) => (
                                        <Fragment key={hour}>
                                            <SelectItem
                                                value={`${hour.toString().padStart(2, "0")}:00`}
                                            >
                                                {convertTo12HourFormat(
                                                    `${hour.toString().padStart(2, "0")}:00`
                                                )}
                                            </SelectItem>
                                            <SelectItem
                                                value={`${hour.toString().padStart(2, "0")}:30`}
                                            >
                                                {convertTo12HourFormat(
                                                    `${hour.toString().padStart(2, "0")}:30`
                                                )}
                                            </SelectItem>
                                        </Fragment>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Time error message */}
                        <ValidationError message={errors.time?.message as string} />
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                    >
                        <Button
                            type="submit"
                            disabled={submiting}
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Update review"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default UpdateReviewsheet;
