import Carousel from "@/components/animation/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader, Mail } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import bgImage from "@/assets/images/login.jpg";
import ApiEndpoints from "@/constants/apiEndpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import { UserContext } from "@/context/userContext";
import basicAxiosInstance from "@/service/basicAxiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/loginForm";

function Form() {
    // From related states
    const [showPassword, setShowPassword] = useState(false);
    const [submiting, setSubmiting] = useState(false);

    // Get role
    const path = useLocation();
    const role = path.pathname.split("/")[1];

    // User Context
    const userContext = useContext(UserContext);

    // Form validator
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(formSchema),
    });

    // Handle submit
    const onSubmit = async (formData: { email: string; password: string }) => {
        setSubmiting(true);

        // Reset isAuth
        localStorage.setItem("isAuth", "0");
        userContext?.setIsAuth(false);

        try {
            // Send request
            const resp = await basicAxiosInstance.post(
                ApiEndpoints.LOGIN,
                {
                    email: formData.email,
                    password: formData.password,
                    role,
                },
                { withCredentials: true }
            );

            const data = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                // Check role with url
                if (data.role !== role) {
                    setSubmiting(false);
                    toast({ title: "Unauthorized Access!" });
                    return;
                }

                setTimeout(() => {
                    setSubmiting(false);

                    // Set isAuth
                    localStorage.setItem("isAuth", "1");
                    userContext?.setIsAuth(true);

                    // Store accesstoken in localstorage
                    localStorage.setItem("accessToken", data.accessToken);

                    toast({ title: "Successfully Logged In" });
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
        <div className="relative z-0 p-5 pr-5 md:pr-0 h-full w-full lg:w-[80%] lg:h-[80%] bg-white rounded-none md:rounded-2xl shadow-custom transition-all duration-300">
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0 overflow-auto no-scrollbar">
                {/* Carousal */}
                <Carousel
                    slides={slides}
                    image={
                        <img src={bgImage} alt="" className="object-cover h-full w-full" />
                    }
                />

                {/* Login form */}
                <div className="w-full h-full flex-1 bg-white">
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
                            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
                            <p className="font-medium">
                                Hey, {role && role[0].toUpperCase() + role?.slice(1)} sign in to
                                your account.
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
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        required
                                        {...register("email")}
                                        className="font-medium p-5 pl-9"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </div>
                                <p className="text-xs text-red-800 font-semibold">
                                    {errors.email && errors.email.message}
                                </p>
                            </motion.div>

                            {/* Input for password */}
                            <motion.div
                                className="space-y-2 relative"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "password" : "text"}
                                        placeholder="Password"
                                        required
                                        autoComplete="off"
                                        {...register("password")}
                                        className="font-medium p-5 pl-9"
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
                                <p className="text-xs text-red-800 font-semibold">
                                    {errors.password && errors.password.message}
                                </p>
                            </motion.div>

                            {/* Forgot password */}
                            {role !== "admin" && (
                                <motion.p
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center justify-end font-medium pt-2"
                                >
                                    <Link to={`/${role}/forgot-password`}>Forgot Password?</Link>
                                </motion.p>
                            )}

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
                                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {submiting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "SignIn"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Form;
