import Carousel from "@/components/animation/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader, Mail } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import bgImage from "@/assets/images/login.jpg";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import { IUserContext, UserContext } from "@/context/user-context";
import basicAxiosInstance from "@/service/basic-axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/authentication/login";
import { useDispatch } from "react-redux";
import { roleAction } from "@/redux/store";
import Breathing from "@/components/animation/breathing";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import ValidationError from "@/components/ui/validation-error";

function Form() {
    // From related states
    const [showPassword, setShowPassword] = useState(false);
    const [submiting, setSubmiting] = useState(false);

    // Get role
    const path = useLocation();
    const role = path.pathname.split("/")[1];

    // Redux
    const dispatch = useDispatch();

    // User context
    const { setIsAuth } = useContext(UserContext) as IUserContext;

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // Form validator
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(formSchema),
    });

    // On submit
    const onSubmit = async (formData: { email: string; password: string }) => {
        setSubmiting(true);

        // Reset isAuth
        localStorage.setItem("isAuth", "0");
        setIsAuth(false);

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
                setTimeout(() => {
                    setSubmiting(false);

                    // Set isAuth
                    localStorage.setItem("isAuth", "1");
                    setIsAuth(true);

                    // Store accesstoken in localstorage
                    localStorage.setItem("accessToken", data.accessToken);

                    toast({ title: "Successfully Logged In" });
                }, 1000);
                // set role in redux
                dispatch(roleAction(data.role));
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
            className="relative z-0 p-5 pr-5 md:pr-0 h-full w-full lg:w-[80%] lg:h-[80%] rounded-none lg:rounded-2xl
         bg-background lg:border border-white dark:border-border shadow-custom transition-all duration-300"
        >
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr] md:grid-rows-1 gap-5 md:gap-0 overflow-auto md:overflow-visible no-scrollbar">
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
                />

                {/* Login form */}
                <div className="w-full h-full bg-background">
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
                            <h1 className="text-2xl text-foreground font-semibold">
                                Welcome Back!
                            </h1>
                            <p className="text-foreground font-medium">
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
                                <Label
                                    htmlFor="email"
                                    className="text-sm text-foreground font-medium"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        autoComplete="off"
                                        required
                                        {...register("email")}
                                        className="p-5 pl-9 text-foreground font-medium"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </div>
                                <ValidationError message={errors.email?.message as string} />
                            </motion.div>

                            {/* Input for password */}
                            <motion.div
                                className="space-y-2 relative"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Label
                                    htmlFor="password"
                                    className="text-sm text-foreground font-medium"
                                >
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
                                <ValidationError message={errors.password?.message as string} />
                            </motion.div>

                            {/* Forgot password */}
                            {role !== "admin" && (
                                <motion.p
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center justify-end text-foreground font-medium pt-2"
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
                                    variant="default"
                                    type="submit"
                                    disabled={submiting}
                                    className="w-full h-11 shadow-lg disabled:cursor-not-allowed"
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
