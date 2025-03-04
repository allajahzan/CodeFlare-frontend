import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    Calendar1,
    CalendarCheck2,
    CalendarRange,
    Clock,
    FolderPen,
    Loader2,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { fetchData, postData } from "@/service/api-service";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/api-endpoints";
import { Student } from "@/types/coordinator";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ValidationError from "@/components/ui/validation-error";
import { IBatch } from "@/components/admin/batch/batches";
import { Review } from "./reviews";
import DatePicker from "./date-picker";
import { formSchema, FormType } from "@/validations/instructor/schedule-review";
import { zodResolver } from "@hookform/resolvers/zod";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setNewReview: React.Dispatch<React.SetStateAction<Review | null>>;
    batches: IBatch[];
}

// Add user sheet
function ScheduleReviewSheet({ button, setNewReview, batches }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Students
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    // Batches
    const [batch, setBatch] = useState<IBatch | null>(null);

    // Week
    const [fetchingWeek, setFetchingWeek] = useState<boolean>(false);

    // Date
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Time
    const [selectedTime, setselectedTime] = useState<String>("");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Form validator
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // OnSubmit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        const data = {
            userId: formData.student,
            batchId: formData.batch,
            title: formData.title,
            week: formData.week.toLowerCase(),
            date: formData.date,
            time: formData.time,
        };

        try {
            // Send request
            const resp = await postData(ApiEndpoints.REVIEW, data, role);

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                setSubmiting(false);
                setNewReview(data);
                setOpen(false);

                toast({ title: "Successfully scheduled a review." });
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Fetch users based on the batch
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetchingStudents(true);
                setStudents([]);
                reset({ student: "" });
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER + `?category=student&batchId=${batch?._id}`,
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

        if (batch) fetchUsers();
    }, [batch]);

    // Fetch week based on the  batch and student
    useEffect(() => {
        const fetchStudentWeek = async () => {
            try {
                setFetchingWeek(true);
                reset({ week: "" });

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.USER + `?batchId=${batch?._id}&_id=${selectedStudent}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp?.data.data;

                    setValue(
                        "week",
                        (data.week && data.week[0] + data.week.slice(1)) || "Week 1"
                    );

                    setFetchingWeek(false);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        selectedStudent && fetchStudentWeek();
    }, [selectedStudent]);

    // Clear fields when sheet closes
    useEffect(() => {
        if (!open) {
            reset();
            setselectedTime("");
            setSelectedDate(undefined);
            setBatch(null);
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent
                onClick={() => setIsOpen(false)}
                className="p-0 flex flex-col gap-0"
            >
                {/* Header */}
                <SheetHeader className="p-5 bg-zinc-0">
                    <SheetTitle className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-muted rounded-full">
                            <CalendarCheck2 className="w-4 h-4" />
                        </div>
                        <span>Schedule review</span>
                    </SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                        Fill in the information below to schedule a review.
                    </SheetDescription>
                </SheetHeader>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onSubmit={handleSubmit(OnSubmit)}
                    className="space-y-3 p-5 overflow-auto"
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

                    {/* Input for batches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="role"
                            className="text-sm text-foreground font-medium"
                        >
                            Batches
                        </Label>
                        <div className="relative">
                            <Select
                                key={"batches"}
                                required
                                onValueChange={(value) => {
                                    setValue("batch", value);
                                    setBatch(batches.find((b) => b._id === value) as IBatch);
                                }}
                            >
                                <SelectTrigger
                                    id="batches"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder="Select a batch"
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {batches.map((batch, index) => (
                                        <SelectItem key={index} value={batch._id}>
                                            {batch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Batch error message */}
                        <ValidationError message={errors.batch?.message as string} />
                    </motion.div>

                    {/* Input for students */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        {/* Label */}
                        <Label
                            htmlFor="students"
                            className="text-sm text-foreground font-medium"
                        >
                            Students
                        </Label>

                        <div className="relative">
                            <Select
                                key="students"
                                required
                                disabled={!students.length || fetchingStudents}
                                onValueChange={(value) => {
                                    setValue("student", value);
                                    setSelectedStudent(value);
                                }}
                            >
                                {/* Select Trigger */}
                                <SelectTrigger
                                    id="students"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                    value={selectedStudent as string}
                                >
                                    <SelectValue
                                        placeholder={
                                            fetchingStudents
                                                ? "Fetching students..."
                                                : students.length === 0
                                                    ? "No students available"
                                                    : "Select a student"
                                        }
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>

                                {/* Student List */}
                                {!fetchingStudents && students.length > 0 && (
                                    <SelectContent className="max-h-[200px]">
                                        {students.map((student) => (
                                            <SelectItem key={student._id} value={student._id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                )}
                            </Select>

                            {/* Loader Icon */}
                            {fetchingStudents && (
                                <Loader2 className="w-4 h-4 absolute left-3 top-[13px] text-foreground animate-spin" />
                            )}

                            {/* Default User Icon (Only Show When Not Fetching) */}
                            {!fetchingStudents && (
                                <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                            )}
                        </div>

                        {/* Error Message */}
                        <ValidationError message={errors.student?.message as string} />
                    </motion.div>

                    {/* Input for week */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
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
                                placeholder={fetchingWeek ? "Finding week" : "Week 1"}
                                required
                                disabled
                                autoComplete="off"
                                {...register("week")}
                                className="text-foreground font-medium p-5 pl-9"
                            />

                            {/* Loader icon */}
                            {fetchingWeek && (
                                <Loader2 className="w-4 h-4 absolute left-3 top-[13px] text-foreground animate-spin" />
                            )}

                            {/* Default icon */}
                            {!fetchingWeek && (
                                <CalendarRange className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                            )}
                        </div>

                        {/* week error message */}
                        <ValidationError message={errors.week?.message as string} />
                    </motion.div>

                    {/* Date picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                    >
                        <Label
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className="text-sm text-foreground font-medium"
                        >
                            Date
                        </Label>
                        <div
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className="relative border p-[9.2px] pl-9 rounded-lg cursor-pointer"
                        >
                            <DatePicker
                                isOpen={isOpen}
                                selectedDate={selectedDate}
                                setSelectedDate={(date) => {
                                    setValue("date", date);
                                    setSelectedDate(date);
                                }}
                                className="absolute z-20 bottom-11 -left-0.5 bg-background"
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
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                    >
                        <Label
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsOpen(!isOpen);
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
                            >
                                <SelectTrigger className="w-full p-3 pl-9 py-5 text-foreground">
                                    <SelectValue placeholder="Pick a time">
                                        <Clock className="mr-2 h-4 w-4 inline" />
                                        {selectedTime}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="h-[170px]">
                                    {Array.from({ length: 24 }, (_, hour) => (
                                        <Fragment key={hour}>
                                            <SelectItem
                                                value={`${hour.toString().padStart(2, "0")}:00`}
                                            >
                                                {`${hour.toString().padStart(2, "0")}:00`}
                                            </SelectItem>
                                            <SelectItem
                                                value={`${hour.toString().padStart(2, "0")}:30`}
                                            >
                                                {`${hour.toString().padStart(2, "0")}:30`}
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
                        transition={{ delay: 0.9 }}
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
                                "Schedule review"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default ScheduleReviewSheet;
