import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Fragment, ReactNode, useContext, useEffect, useState } from "react";
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
    CalendarCheck2,
    CalendarDays,
    CalendarRange,
    Clock,
    FolderPen,
    ListFilter,
    Loader2,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { fetchData, postData } from "@/service/api-service";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/api-endpoints";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ValidationError from "@/components/ui/validation-error";
import DatePicker from "./date-picker";
import { formSchema, FormType } from "@/validations/instructor/schedule-review";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { IStudent } from "@/types/IStudent";
import { IReview } from "@/types/IReview";
import { IBatch, IDomainsWeek } from "@codeflare/common";
import { IUserContext, UserContext } from "@/context/user-context";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setNewReview: React.Dispatch<React.SetStateAction<IReview | null>>;
}

// Add user sheet
function ScheduleReviewSheet({ button, setNewReview }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Students
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [fetchingStudents, setFetchingStudents] = useState(false);

    // Batches
    const [batches, setBatches] = useState<IBatch[]>([]);
    const [batch, setBatch] = useState<IBatch | null>(null);

    // Week
    const [fetchingWeek, setFetchingWeek] = useState<boolean>(false);
    const [weekName, setWeekName] = useState<string>("");

    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Time
    const [selectedTime, setselectedTime] = useState<string>("");

    // User context
    const { user } = useContext(UserContext) as IUserContext;

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
            category: formData.category,
            batchId: formData.batch,
            studentId: formData.student,
            domainId: formData.domain,
            weekId: formData.week,
            title: formData.title,
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

    // Fetch users based on the batch and domain
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetchingStudents(true);
                setStudents([]);
                setValue("student", "");
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?roleWise=student&batchId=${batch?._id}&domainId=${user?.domain?._id}`,
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

    // Fetch week domain and title based on the student
    useEffect(() => {
        const fetchStudentWeek = async () => {
            try {
                setFetchingWeek(true);
                setWeekName("");
                setValue("week", "");
                setValue("title", "");

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.USER + `?batchId=${batch?._id}&_id=${selectedStudent}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp?.data.data;

                    // Set week name
                    setWeekName(data.week?.name || "");

                    // Set week
                    setValue("week", data.week?._id || "");

                    // Set domain
                    setValue("domain", data.domain?._id || "");

                    // Set title
                    const week = data.domain?.domainsWeeks.find(
                        (week: IDomainsWeek) => week.week._id === data.week?._id
                    );

                    if (week) {
                        setValue("title", week.title);
                    } else {
                        setValue("title", "Foundation Period");
                    }

                    setFetchingWeek(false);
                }
            } catch (err: unknown) {
                setFetchingWeek(false);
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
            setStudents([]);
            setSelectedStudent("");
            setWeekName("");
        }
    }, [open]);

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

                    {/* Input for batches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="batches"
                            className="text-sm text-foreground font-medium"
                        >
                            Batches
                        </Label>
                        <div className="relative">
                            <Select
                                key={"batches"}
                                name="batches"
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
                                name="students"
                                required
                                disabled={!students.length || fetchingStudents}
                                value={selectedStudent}
                                onValueChange={(value) => {
                                    setValue("student", value);
                                    setSelectedStudent(value);
                                }}
                            >
                                {/* Select Trigger */}
                                <SelectTrigger
                                    id="students"
                                    className="text-foreground font-medium p-5 pl-9 relative"
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
                                placeholder={fetchingWeek ? "Finding week" : "Week"}
                                required
                                disabled
                                autoComplete="off"
                                value={weekName}
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
                    </motion.div>

                    {/* Input for title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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
                                placeholder="Title"
                                required
                                autoComplete="off"
                                disabled
                                {...register("title")}
                                className="text-foreground font-medium p-5 pl-9"
                            />

                            {/* Loader icon */}
                            {fetchingWeek && (
                                <Loader2 className="w-4 h-4 absolute left-3 top-[13px] text-foreground animate-spin" />
                            )}

                            {/* Default icon */}
                            {!fetchingWeek && (
                                <FolderPen className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                            )}
                        </div>
                    </motion.div>

                    {/* Date picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                    >
                        <Label 
                            htmlFor="date"
                            className="text-sm text-foreground font-medium"
                        >
                            Date
                        </Label>

                        <Select 
                        key="date" name="date">
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
                        transition={{ delay: 0.9 }}
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
                                key="time"
                                name="time"
                                onValueChange={(value) => {
                                    setselectedTime(value);
                                    setValue("time", value);
                                }}
                            >
                                <SelectTrigger id="time" className="w-full p-3 pl-9 py-5 text-foreground">
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
                        transition={{ delay: 1 }}
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
