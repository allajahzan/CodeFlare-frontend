import Carousel from "@/components/animation/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "@/assets/images/verifyEmail.jpg";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import basicAxiosInstance from "@/service/basic-axios-instance";
import { useForm } from "react-hook-form";
import {
    formSchema,
    FormType,
} from "@/validations/authentication/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import Breathing from "@/components/animation/breathing";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import ValidationError from "@/components/ui/validation-error";

function Form() {
    const [submiting, setSubmiting] = useState(false);

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // Get role
    const path = useLocation();
    const role = path.pathname.split("/")[1];

    const navigate = useNavigate();

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // On submit
    const onSubmit = async (formData: { email: string }) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await basicAxiosInstance.post(ApiEndpoints.VERIFY_EMAIL, {
                email: formData.email,
                role,
            });

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);

                    toast({ title: "Password reset link has been sent to your email." });

                    reset();
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setSubmiting(false);
                handleCustomError(err);
            }, 1000);
        }
    };

    // Carousal data
    const slides = useMemo(
        () => [
            {
                id: 1,
                title: "Welcome to CodeFlare",
                description: "Your all-in-one business solution",
            },
            {
                id: 2,
                title: "Streamline Your Workflow",
                description: "Efficient tools for modern teams",
            },
            {
                id: 3,
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your data",
            },
        ],
        []
    );

    return (
        <div
            className="relative z-0 p-5 pl-5 md:pl-0 h-full w-full lg:w-[80%] lg:h-[80%] rounded-none lg:rounded-2xl
         bg-background lg:border border-white dark:border-border shadow-custom transition-all duration-300"
        >
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr] md:grid-rows-1 gap-5 md:gap-0 overflow-auto no-scrollbar">
                {/* Login form */}
                <div className="w-full h-full bg-background order-2 md:order-1">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="p-0 px-0 md:px-12 lg:px-20 flex flex-col justify-evenly md:justify-center gap-10 h-full"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center space-y-5"
                        >
                            <h1 className="text-2xl text-foreground font-semibold">Forgot Password?</h1>
                            <p className="text-foreground font-medium">
                                We will send a reset link to your email.
                            </p>
                        </motion.div>

                        {/* form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            {/* Input for email */}
                            <motion.div
                                className="space-y-2 relative"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
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
                                        placeholder="Email"
                                        autoComplete="off"
                                        required
                                        {...register("email")}
                                        className="text-foreground font-medium p-5 pl-9 border"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </div>
                                <ValidationError message={errors.email?.message as string} />
                            </motion.div>

                            {/* Submit button */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: role == "admin" ? 0.6 : 0.7 }}
                                className="pt-2"
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
                                        "Reset Password"
                                    )}
                                </Button>
                            </motion.div>

                            {/* Go back to login */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: role == "admin" ? 0.6 : 0.7 }}
                                className="pt-2"
                            >
                                <Button
                                    onClick={() => navigate(`/${role}/login`)}
                                    type="button"
                                    className="w-full h-11 bg-transparent hover:bg-transparent dark:hover:bg-transparent text-foreground shadow-none"
                                >
                                    <div className="flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to login
                                    </div>
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>

                {/* Carousal */}
                <Carousel
                    slides={slides}
                    image={
                        <div className="relative h-full rounded-2xl">
                            {/* Breathing animation */}
                            {theme === "dark" && <Breathing />}
                            <img
                                src={bgImage}
                                alt=""
                                className="object-cover h-full w-full rounded-2xl dark:border-2"
                            />
                        </div>
                    }
                    className="order-1 md:order-2"
                />
            </div>
        </div>
    );
}

export default Form;
