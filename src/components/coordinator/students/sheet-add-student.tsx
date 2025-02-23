import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useEffect, useState } from "react";
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
    Loader2,
    Mail,
    MessageSquare,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { postData } from "@/service/api-service";
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

// Interface for Props
interface PropsType {
    button: ReactNode;
    setNewStudent: React.Dispatch<React.SetStateAction<Student | null>>;
    batches: IBatch[];
}

// Add user sheet
function AddStudentSheet({ button, setNewStudent, batches }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

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
            const resp = await postData(
                ApiEndpoints.USER,
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role.toLowerCase(),
                    batch: formData.batch,
                    message: formData.message,
                },
                role
            );

            const user = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setOpen(false);
                setSubmiting(false);
                reset();

                // Set new user
                setNewStudent(user);

                toast({ title: "Student added successfully." });
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Clear fields when sheet closes
    useEffect(() => {
        if (!open) {
            reset();
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
                            <UserRoundPlus className="w-4 h-4" />
                        </div>
                        <span>Add new student</span>
                    </SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                        Fill in the information below to add a new student.
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
                        <Label
                            htmlFor="name"
                            className="text-sm text-foreground font-medium"
                        >
                            Full Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder="Enter student's full name"
                                required
                                autoComplete="off"
                                {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <UserRoundPlus className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Name error message */}
                        <ValidationError message={errors.name?.message as string} />
                    </motion.div>

                    {/* Input for email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="email"
                            className="text-sm text-foreground font-medium"
                        >
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
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Email error message */}
                        <ValidationError message={errors.email?.message as string} />
                    </motion.div>

                    {/* Confirm email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="confirmEmail"
                            className="text-sm text-foreground font-medium"
                        >
                            Confirm Email Address
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmEmail"
                                type="email"
                                placeholder="student@gmail.com"
                                required
                                autoComplete="off"
                                {...register("confirmEmail")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Confirm email error message */}
                        <ValidationError message={errors.confirmEmail?.message as string} />
                    </motion.div>

                    {/* Input for role */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="role"
                            className="text-sm text-foreground font-medium"
                        >
                            Role
                        </Label>
                        <div className="relative">
                            <Input
                                id="role"
                                type="text"
                                required
                                autoComplete="off"
                                readOnly
                                value={"Student"}
                                {...register("role")}
                                className="text-foreground font-medium p-5 pl-9 cursor-not-allowed"
                            />
                            <BriefcaseIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Role error message */}
                        <ValidationError message={errors.role?.message as string} />
                    </motion.div>

                    {/* Input for batch */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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

                    {/* Input fot message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="message"
                            className="text-sm text-foreground font-medium"
                        >
                            Personal Message (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="message"
                                placeholder="Add a personal message to the invitation"
                                autoComplete="off"
                                {...register("message")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <MessageSquare className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
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
                                "Send Invitation"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default AddStudentSheet;
