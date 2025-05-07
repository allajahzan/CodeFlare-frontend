import Carousel from "@/components/animation/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import {
    Fragment,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bgImage from "@/assets/images/resetPassword1.jpg";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import basicAxiosInstance from "@/service/basic-axios-instance";
import { useForm } from "react-hook-form";
import {
    formSchema,
    FormType,
} from "@/validations/authentication/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import Breathing from "@/components/animation/breathing";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import ValidationError from "@/components/ui/validation-error";

function Form() {
    const [isMount, setMount] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [submiting, setSubmiting] = useState(false);

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // Get role
    const path = useLocation();
    const role = path.pathname.split("/")[1];

    const navigate = useNavigate();

    // Get query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // On submit
    const onSubmit = async (formData: {
        password: string;
        confirmPassword: string;
    }) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await basicAxiosInstance.post(
                ApiEndpoints.RESET_PASSWORD + token,
                {
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }
            );

            // Success response
            if (resp && resp.status === 200) {
                setSubmiting(false);
                toast({ title: "Your password has been successfully reset." });
                reset();
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Check reset password link has expired when page load
    useLayoutEffect(() => {
        const checkResetLink = async () => {
            try {
                // Send request
                const resp = await basicAxiosInstance.get(
                    ApiEndpoints.CHECK_RESET_PASSWORD_LINK + token
                );

                // Success response
                if (resp && resp.status === 200) {
                    setMount(true);
                }
            } catch (err: any) {
                if (err.status === 410 || err.status === 404) setMount(false);
                else {
                    setMount(true);
                    handleCustomError(err);
                }
            }
        };

        checkResetLink();
    }, []);

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
                description: "Efficient platform for modern teams",
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
        <Fragment>
            {isMount === true && (
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
                                    <h1 className="text-2xl text-foreground font-semibold">
                                        Reset your password!
                                    </h1>
                                    <p className="text-foreground font-medium">
                                        Hey, {role && role[0].toUpperCase() + role?.slice(1)} reset
                                        your password.
                                    </p>
                                </motion.div>

                                {/* form */}
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                    {/* Input for new password */}
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
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "password" : "text"}
                                                placeholder="Password"
                                                required
                                                autoComplete="off"
                                                {...register("password")}
                                                className="text-foreground font-medium p-5 pl-9 border"
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
                                        <ValidationError
                                            message={errors.password?.message as string}
                                        />
                                    </motion.div>

                                    {/* Input for confirm password */}
                                    <motion.div
                                        className="space-y-2 relative"
                                        initial={{ opacity: 1, y: 0 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
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
                                                placeholder="Confirm password"
                                                required
                                                autoComplete="off"
                                                {...register("confirmPassword")}
                                                className="text-foreground font-medium p-5 pl-9 border"
                                            />
                                            <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                        </div>
                                        <ValidationError
                                            message={errors.confirmPassword?.message as string}
                                        />
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
                                                    <Loader2 className="h-4 w-4 animate-spin" />
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
            )}
            {isMount === false && (
                <div className="relative h-screen w-full z-0 flex flex-col items-center justify-center p-5 space-y-5">
                    <h1 className="text-foreground font-bold text-2xl">
                        Sorry, this page isn't available.
                    </h1>
                    <p className="text-center text-foreground font-medium text-lg">
                        The link you followed may be broken, or the page may have been
                        removed.{" "}
                        <Link to={`/${role}/login`} replace>
                            Go back to CodeFlare
                        </Link>
                    </p>
                </div>
            )}
        </Fragment>
    );
}

export default Form;
