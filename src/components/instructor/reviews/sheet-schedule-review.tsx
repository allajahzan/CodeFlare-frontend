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
    CalendarDays,
    Clock,
    FolderPen,
    Loader2,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { fetchData, postData } from "@/service/api-service";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/api-endpoints";
import { Student } from "@/types/coordinator";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/coordinator/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ValidationError from "@/components/ui/validation-error";
import { IBatch } from "@/components/admin/batch/batches";
import { Review } from "./reviews";
import { DatePickerDemo } from "./date-picker";
import { format } from "date-fns";

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

    const [students, setStudents] = useState<Student[]>([]);
    const [batch, setBatch] = useState<IBatch | null>(null);
    const [fetching, setFetching] = useState(false);

    // Date
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Time
    const [selectedTime, setselectedTime] = useState<String>("");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Fetch users based on the batch
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetching(true);
                setStudents([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER + `?category=student&batchId=${batch?._id}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const users = resp?.data.data;

                    // Set users
                    setTimeout(() => {
                        setStudents(users);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };
        batch && fetchUsers();
    }, [batch]);

    // Clear fields when sheet closes
    useEffect(() => {
        if (!open) {
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
                            <UserRoundPlus className="w-4 h-4" />
                        </div>
                        <span>Schedule reviews</span>
                    </SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                        Fill in the information below to schedule new review.
                    </SheetDescription>
                </SheetHeader>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    // onSubmit={handleSubmit(OnSubmit)}
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
                                placeholder="Enter a title"
                                required
                                autoComplete="off"
                                // {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <FolderPen className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Title error message */}
                        {/* <ValidationError message={errors.name?.message as string} /> */}
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
                                    // setValue("batch", value);
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
                        {/* <ValidationError message={errors.batch?.message as string} /> */}
                    </motion.div>

                    {/* Input for students */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="role"
                            className="text-sm text-foreground font-medium"
                        >
                            Students
                        </Label>
                        <div className="relative">
                            <Select
                                key={"students"}
                                required
                                onValueChange={(value) => {
                                    // setValue("batch", value);
                                    console.log(value);
                                }}
                            >
                                <SelectTrigger
                                    id="students"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder={
                                            fetching
                                                ? "Fetching students"
                                                : students.length > 0
                                                    ? "Select a student"
                                                    : "No students in this batch"
                                        }
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                {!fetching && students.length > 0 && (
                                    <SelectContent className="max-h-[200px]">
                                        {students.map((student, index) => (
                                            <SelectItem key={index} value={student._id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                )}
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Batch error message */}
                        {/* <ValidationError message={errors.batch?.message as string} /> */}
                    </motion.div>

                    {/* Date picker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
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
                            <DatePickerDemo
                                isOpen={isOpen}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                            <p className="text-foreground font-medium">
                                {selectedDate ? (
                                    format(selectedDate, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </p>

                            <CalendarDays className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Date error message */}
                        {/* <ValidationError message={errors.confirmEmail?.message as string} /> */}
                    </motion.div>

                    {/* Time picker */}
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
                            Time
                        </Label>
                        <div className="relative">
                            <Select onValueChange={setselectedTime}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Pick a time">
                                        <Clock className="mr-2 h-4 w-4 inline" />
                                        {selectedTime}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="h-[160px]">
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
                        </div>

                        {/* Time error message */}
                        {/* <ValidationError message={errors.confirmEmail?.message as string} /> */}
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
                                "Send Invitation"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default ScheduleReviewSheet;
