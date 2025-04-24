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
    Calendar1,
    CalendarCheck2,
    CalendarRange,
    Clock,
    FolderPen,
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
import { IReview } from "@/types/review";

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
    const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Time
    const [selectedTime, setselectedTime] = useState<string>("");

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
                formData,
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
                            ...formData,
                            updatedAt: data.updatedAt,
                        }
                        : null
                );

                // Update the reviews list
                setReviews((prevReviews: IReview[]) => {
                    return prevReviews.map((review) =>
                        review._id === selectedReview?._id
                            ? { ...review, ...formData }
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
            title: selectedReview.title,
            week: selectedReview.week,
            date: new Date(selectedReview.date),
            time: selectedReview.time,
        });

        setSelectedDate(new Date(selectedReview.date));
        setselectedTime(selectedReview.time);
        setSubmiting(false);
        setDatePickerOpen(false);
    }, [open, reset, selectedReview]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent
                onClick={() => setDatePickerOpen(false)}
                className="p-0 flex flex-col gap-0"
            >
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
                    {/* Input for title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
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
                                autoComplete="off"
                                {...register("title")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <FolderPen className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Title error message */}
                        <ValidationError message={errors.title?.message as string} />
                    </motion.div>

                    {/* Week */}
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
                                required
                                disabled
                                autoComplete="off"
                                {...register("week")}
                                className="text-foreground font-medium p-5 pl-9"
                            />

                            <CalendarRange className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* week error message */}
                        <ValidationError message={errors.week?.message as string} />
                    </motion.div>

                    {/* Date picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label
                            onClick={(event) => {
                                event.stopPropagation();
                                setDatePickerOpen(!isDatePickerOpen);
                            }}
                            className="text-sm text-foreground font-medium"
                        >
                            Date
                        </Label>
                        <div
                            onClick={(event) => {
                                event.stopPropagation();
                                setDatePickerOpen(!isDatePickerOpen);
                            }}
                            className="relative border p-[9.2px] pl-9 rounded-lg cursor-pointer"
                        >
                            <DatePicker
                                isDatePickerOpen={isDatePickerOpen}
                                selectedDate={selectedDate}
                                setSelectedDate={(date) => {
                                    setValue("date", date);
                                    setSelectedDate(date);
                                }}
                                className="absolute z-20 top-11 -left-0.5 bg-background"
                            />
                            <p className="text-foreground font-medium">
                                {selectedDate ? (
                                    selectedDate.toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </p>

                            <Calendar1 className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Date error message */}
                        <ValidationError message={errors.date?.message as string} />
                    </motion.div>

                    {/* Time picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label
                            onClick={(event) => {
                                event.stopPropagation();
                                setDatePickerOpen(!isDatePickerOpen);
                            }}
                            className="text-sm text-foreground font-medium"
                        >
                            Time
                        </Label>
                        <div className="relative">
                            <Select
                                onValueChange={(value) => {
                                    setselectedTime(value);
                                    setValue("time", value);
                                }}
                                defaultValue={selectedTime}
                            >
                                <SelectTrigger className="w-full p-3 pl-9 py-5 text-foreground">
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
                        {/* <ValidationError message={errors.time?.message as string} /> */}
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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
