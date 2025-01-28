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
    Loader,
    Mail,
    MessageSquare,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { postData } from "@/service/apiService";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/apiEndpoints";
import { User } from "@/types/admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/admin/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    MultiSelector,
    MultiSelectorContent,
    TriggerMultiSelector,
} from "@/components/ui/multi-selector";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ValidationError from "@/components/ui/validation-error";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setNewUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Add user sheet
function AddUserSheet({ button, setNewUser }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Drop down for batches
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

    // Inputs
    const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // On submit
    const onSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await postData(
                ApiEndpoints.USER,
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    batches: formData.batches.split(", "),
                    message: formData.message,
                },
                role
            );

            const user = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);
                    reset();
                    setSelectedBatches([]);

                    // Set new user
                    setNewUser(user);

                    // Close sheet
                    setOpen(false);

                    toast({ title: "User added successfully." });
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setSubmiting(false);
                handleCustomError(err);
            }, 1000);
        }
    };

    // Handle select batches
    const handleSelectBatches = (value: string) => {
        setSelectedBatches((batches) => {
            const updatedBatches = batches.includes(value)
                ? batches.filter((batch) => batch !== value)
                : [...batches, value];

            setValue("batches", updatedBatches.join(", "));
            return updatedBatches;
        });
    };

    // Clear fields when sheet closes
    useEffect(() => {
        if (!open) {
            reset();
            setDropDownOpen(false);
            setSelectedBatches([]);
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
                        <span>Add new user</span>
                    </SheetTitle>
                    <SheetDescription className="text-foreground font-medium">
                        Fill in the information below to add a new user.
                    </SheetDescription>
                </SheetHeader>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onSubmit={handleSubmit(onSubmit)}
                    onClick={() => setDropDownOpen(false)}
                    className="space-y-3 p-5 overflow-auto h-full"
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
                                type="text"
                                placeholder="Enter user's full name"
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
                                placeholder="user@gmail.com"
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

                    {/* Input for role */}
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
                            Role
                        </Label>
                        <div className="relative">
                            <Select
                                key="role"
                                required
                                onValueChange={(value: string) =>
                                    setValue("role", value, { shouldValidate: true })
                                }
                            >
                                <SelectTrigger
                                    id="role"
                                    className="text-foreground font-medium p-5 pl-9"
                                >
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                </SelectContent>
                            </Select>
                            <BriefcaseIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {/* Role error message */}
                        <ValidationError message={errors.role?.message as string} />
                    </motion.div>

                    {/* Input for batches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="batches"
                            className="text-sm text-foreground font-medium"
                        >
                            Batches
                        </Label>
                        <MultiSelector
                            triggerMultiSelector={
                                <TriggerMultiSelector
                                    fieldName="batches"
                                    setDropDownOpen={setDropDownOpen}
                                    dropDownOpen={dropDownOpen}
                                    Icon={UsersRound}
                                    register={register}
                                />
                            }
                            multiSelectorContent={
                                <MultiSelectorContent
                                    dropDownOpen={dropDownOpen}
                                    handleSelect={handleSelectBatches}
                                    values={["Batch 1", "Batch 2", "Batch 3"]}
                                    selectedBatches={selectedBatches}
                                />
                            }
                        />
                        {/* Batches error message */}
                        <ValidationError message={errors.batches?.message as string} />
                    </motion.div>

                    {/* Input fot message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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
                                    <Loader className="h-4 w-4 animate-spin" />
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

export default AddUserSheet;
