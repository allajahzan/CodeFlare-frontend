import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useLayoutEffect, useState } from "react";
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
    BriefcaseIcon,
    Loader,
    Mail,
    MessageSquare,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { updateData } from "@/service/apiService";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/apiEndpoints";
import { Student } from "@/types/coordinator";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/coordinator/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setStudents: React.Dispatch<React.SetStateAction<[] | Student[]>>;
    setSelectedStudent: React.Dispatch<React.SetStateAction<Student>>;
    selecteStudent: Student;
    batches: string[];
}

// Add user sheet
function EditStudentSheet({
    button,
    batches,
    setStudents,
    selecteStudent,
    setSelectedStudent,
}: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Input
    const [selectedBatch, setSelectedBatch] = useState<string>("");

    // Form validator
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // On submit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await updateData(
                ApiEndpoints.USER + `/${selecteStudent._id}`,
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role.toLowerCase(),
                    batch: formData.batch,
                    message: formData.message,
                },
                role
            );

            const student = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);
                    reset();

                    // Set updated student in selected student
                    setSelectedStudent(student);

                    // Set updated student in students list
                    setStudents((prevStudents) =>
                        prevStudents.map((u) =>
                            u._id === student._id ? { ...u, ...student } : u
                        )
                    );

                    // Close sheet
                    setOpen(false);

                    toast({ title: "Student updated successfully." });
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setSubmiting(false);
                handleCustomError(err);
            }, 1000);
        }
    };

    // Reset form values
    useLayoutEffect(() => {
        if (selecteStudent) {
            reset({
                name: selecteStudent.name || "",
                email: selecteStudent.email || "",
                role:
                    selecteStudent.role[0].toUpperCase() + selecteStudent.role.slice(1) ||
                    "",
                batch: selecteStudent.batch || "",
            });
            setSelectedBatch(selecteStudent.batch);
        }
    }, [selecteStudent, reset, open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
                {/* Header */}
                <SheetHeader className="p-5 bg-zinc-0">
                    <SheetTitle className="text-foreground">
                        Update selected student
                    </SheetTitle>
                    <SheetDescription className="font-medium text-foreground">
                        Update the information below to change student's details.
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
                    {/* Input for name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder="Enter student's full name"
                                required
                                autoComplete="off"
                                {...register("name")}
                                className="font-medium p-5 pl-9"
                            />
                            <UserRoundPlus className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {/* Name error message */}
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.name?.message}
                        </p>
                    </motion.div>

                    {/* Input for email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@gmail.com"
                                required
                                autoComplete="off"
                                {...register("email")}
                                className="font-medium p-5 pl-9"
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {/* Email error message */}
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.email?.message}
                        </p>
                    </motion.div>

                    {/* Input for role */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="role" className="text-sm font-medium">
                            Role
                        </Label>
                        <div className="relative">
                            <Input
                                id="role"
                                type="text"
                                required
                                autoComplete="off"
                                disabled
                                {...register("role")}
                                className="font-medium p-5 pl-9 cursor-not-allowed"
                            />
                            <BriefcaseIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {/* Role error message */}
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.role?.message}
                        </p>
                    </motion.div>

                    {/* Input for batch */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="role" className="text-sm font-medium">
                            Batches
                        </Label>
                        <div className="relative">
                            <Select
                                key={"batches"}
                                required
                                value={selectedBatch}
                                onValueChange={(value) => {
                                    setSelectedBatch(value);
                                    setValue("batch", value);
                                }}
                            >
                                <SelectTrigger
                                    id="batches"
                                    className="font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder="Select a batch"
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {batches.map((batch, index) => (
                                        <SelectItem key={index} value={batch}>
                                            {batch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {/* Batch error message */}
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.batch?.message}
                        </p>
                    </motion.div>

                    {/* Input fot message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="message" className="text-sm font-medium">
                            Personal Message (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="message"
                                placeholder="Add a personal message to the invitation"
                                autoComplete="off"
                                {...register("message")}
                                className="font-medium p-5 pl-9"
                            />
                            <MessageSquare className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
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
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default EditStudentSheet;
