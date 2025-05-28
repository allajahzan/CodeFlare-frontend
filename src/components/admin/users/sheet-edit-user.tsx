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
    Loader2,
    Mail,
    Pencil,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { fetchData, updateData } from "@/service/api-service";
import { toast } from "@/hooks/use-toast";
import ApiEndpoints from "@/constants/api-endpoints";
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
import { IUser } from "@/types/IUser";
import { IBatch } from "@codeflare/common";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setUsers: React.Dispatch<React.SetStateAction<[] | IUser[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUser>>;
    selectedUser: IUser;
}

// Add user sheet
function EditUserSheet({
    button,
    setUsers,
    selectedUser,
    setSelectedUser,
}: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Drop down for batches
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

    const [batches, setBatches] = useState<IBatch[]>([]);

    // Inputs
    const [selectedBatches, setSelectedBatches] = useState<IBatch[]>([]);

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
                    ...(formData.role === "coordinator" && {
                        batches: selectedBatches.map((b) => b._id),
                    }),
                },
                role
            );

            const user = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setOpen(false);
                setSubmiting(false);
                reset();

                // Set updated user in selected user
                setSelectedUser(user);

                // Set updated user in users list
                setUsers((prevUsers) =>
                    prevUsers.map((u) => (u._id === user._id ? { ...u, ...user } : u))
                );

                toast({ title: "User updated successfully." });
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Handle select batches
    const handleSelectBatches = (value: IBatch) => {
        setSelectedBatches((batches) => {
            const isSelected = batches.some((batch) => batch._id === value._id);

            const updatedBatches = isSelected
                ? batches.filter((batch) => batch._id !== value._id) // Remove if already selected
                : [...batches, value]; // Add if not selected

            setValue("batches", updatedBatches.map((b) => b.name).join(", "));

            return updatedBatches;
        });
    };

    // Fetch batches
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setBatches([]);

                // Send request
                const resp = await fetchData(ApiEndpoints.BATCH + "?type=unassigned", role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data.data;

                    // Set batches
                    setBatches(data);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

       open && fetchBatches();
    }, [open]);

    // Reset form values
    useLayoutEffect(() => {
        if (selectedUser) {
            reset({
                name: selectedUser.name || "",
                email: selectedUser.email || "",
                role: selectedUser.role || "",
                ...(selectedUser.role === "coordinator" && {
                    batches: selectedUser.batches?.map((b) => b.name).join(", ") || "",
                }),
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
                    <SheetTitle className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-muted rounded-full">
                            <Pencil className="w-4 h-4" />
                        </div>
                        <span>Update selected user</span>
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground font-medium">
                        Update the information below to change user's details.
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
                                placeholder="user@gmail.com"
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
                            <Select
                                key="role"
                                name="role"
                                required
                                value={selectedUser.role || ""}
                                disabled
                                onValueChange={(value: string) =>
                                    setValue("role", value, { shouldValidate: true })
                                }
                            >
                                <SelectTrigger
                                    id="role"
                                    className="text-foreground bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark font-medium p-5 pl-9"
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
                    {selectedUser.role === "coordinator" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-2"
                        >
                            <Label
                                htmlFor="batches"
                                className="text-sm text-foreground font-medium"
                                onClick={(event) => event.stopPropagation()}
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
                                        values={batches}
                                        selectedBatches={selectedBatches}
                                    />
                                }
                            />

                            {/* Batches error message */}
                            <ValidationError message={errors.batches?.message as string} />
                        </motion.div>
                    )}

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
                                "Update"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default EditUserSheet;
