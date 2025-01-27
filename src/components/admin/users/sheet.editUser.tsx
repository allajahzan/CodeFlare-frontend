import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
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
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { updateData } from "@/service/apiService";
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

// Interface for Props
interface PropsType {
    button: ReactNode;
    selectedUser: User;
}

// Add user sheet
function EditUserSheet({ button, selectedUser }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

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
            const resp = await updateData(
                ApiEndpoints.USER + `/${selectedUser._id}`,
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    batches: formData.batches.split(", "),
                }
            );

            const user = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);

                    // set updated user
                    selectedUser = user;

                    // Close sheet
                    setOpen(false);

                    toast({ title: "User updated successfully." });
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

    // Reset form values
    useLayoutEffect(() => {
        if (selectedUser) {
            reset({
                name: selectedUser.name || "",
                email: selectedUser.email || "",
                role: selectedUser.role || "",
                batches: selectedUser.batches?.join(", ") || "",
            });
            // Set selected batches
            setSelectedBatches(selectedUser.batches);
        }
    }, [selectedUser, reset, open]);

    // Close drop down when sheet close
    useEffect(() => {
        if (!open) {
            setDropDownOpen(false);
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
                {/* Header */}
                <SheetHeader className="p-5 bg-zinc-0">
                    <SheetTitle className="text-foreground">Add new user</SheetTitle>
                    <SheetDescription className="font-medium text-foreground">
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
                        <Label htmlFor="name" className="text-sm font-medium">
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
                                placeholder="user@gmail.com"
                                required
                                readOnly
                                autoComplete="off"
                                {...register("email")}
                                className="font-medium p-5 pl-9 cursor-not-allowed"
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
                            <Select
                                key="role"
                                required
                                value={selectedUser.role || ""}
                                onValueChange={(value: string) =>
                                    setValue("role", value, { shouldValidate: true })
                                }
                            >
                                <SelectTrigger id="role" className="font-medium p-5 pl-9">
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
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.role?.message}
                        </p>
                    </motion.div>

                    {/* Input for batches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="batches" className="text-sm font-medium">
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
                        <p className="text-xs text-red-800 font-semibold">
                            {errors.batches?.message}
                        </p>
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
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Update User"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default EditUserSheet;
