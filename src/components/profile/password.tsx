import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormType } from "@/validations/profile/change-password";
import ValidationError from "../ui/validation-error";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { patchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

// Password Components
function Password() {
    // Form related states
    const [submiting, setSubmiting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // On submit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        const data = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        };

        try {
            const resp = await patchData(ApiEndpoints.CHANGE_PASSWORD, data, role);

            if (resp && resp.status === 200) {
                setSubmiting(false);
                reset();

                toast({ title: "Successfully changed the password." });
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onSubmit={handleSubmit(OnSubmit)}
            className="space-y-5"
        >
            {/* Current password */}
            <motion.div
                className="space-y-2 relative"
                key={1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Label
                    htmlFor="currentPassword"
                    className="text-sm text-foreground font-medium"
                >
                    Current Password
                </Label>
                <div className="relative">
                    <Input
                        id="currentPassword"
                        type={showPassword ? "password" : "text"}
                        placeholder="Current Password"
                        required
                        autoComplete="off"
                        {...register("currentPassword")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 absolute right-0 bottom-[3px] text-muted-foreground hover:text-zinc-500 cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </div>
                </div>

                {/* Current password error */}
                <ValidationError message={errors.currentPassword?.message as string} />
            </motion.div>

            {/* New password */}
            <motion.div
                className="space-y-2 relative"
                key={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Label
                    htmlFor="NewPassword"
                    className="text-sm text-foreground font-medium"
                >
                    New Password
                </Label>
                <div className="relative">
                    <Input
                        id="NewPassword"
                        type={showPassword ? "password" : "text"}
                        placeholder="New Password"
                        required
                        autoComplete="off"
                        {...register("newPassword")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* New password error */}
                <ValidationError message={errors.newPassword?.message as string} />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
                className="space-y-2 relative"
                key={3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Label
                    htmlFor="confirmPassword"
                    className="text-sm text-foreground font-medium"
                >
                    Confirm Password
                </Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "password" : "text"}
                        placeholder="Confirm Password"
                        required
                        autoComplete="off"
                        {...register("confirmPassword")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 absolute right-0 bottom-[3px] text-muted-foreground hover:text-zinc-500 cursor-pointer"
                    ></div>
                </div>

                {/* Confirm password error */}
                <ValidationError message={errors.confirmPassword?.message as string} />
            </motion.div>

            {/* Button */}
            <motion.div
                key={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-2 w-full"
            >
                <Button
                    variant="default"
                    type="submit"
                    disabled={submiting}
                    className="w-full h-11 shadow-md disabled:cursor-not-allowed"
                >
                    {submiting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        "Change"
                    )}
                </Button>
            </motion.div>
        </motion.form>
    );
}

export default Password;
