import Carousel from "@/components/animation/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader } from "lucide-react";
import React, { Fragment, useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bgImage from "@/assets/images/resetPassword1.jpg";
import { userApi } from "@/api/userApi";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import basicAxiosInstance from "@/utils/basicAxiosInstance";

function Form() {
    const [isMount, setMount] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Inputs
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const path = useLocation();
    const navigate = useNavigate();

    // Get query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    // Handle submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmiting(true);

        try {
            // Send request
            const resp = await basicAxiosInstance.post(userApi.resetPassword + token, {
                password,
                confirmPassword,
            });

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);

                    toast({ title: "Your password has been successfully reset." });
                    setPassword("");
                    setConfirmPassword("");
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setSubmiting(false);
                handleCustomError(err);
            }, 1000);
        }
    };

    // Set role
    useLayoutEffect(() => {
        setRole(path.pathname.split("/")[1]);
    }, [path]);

    // Check reset link has expired when page load
    useLayoutEffect(() => {
        const checkResetLink = async () => {
            try {
                // Send request
                const resp = await basicAxiosInstance.post(userApi.resetPassword + token);

                // Success response
                if (resp && resp.status === 200) {
                    setMount(true);
                }
            } catch (err: unknown) {
                setMount(false);
                return;
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
                <div className="relative z-0 p-5 pl-5 md:pl-0 h-full w-full lg:w-[80%] lg:h-[80%] bg-white rounded-none md:rounded-2xl shadow-custom overflow-auto no-scrollbar transition-all duration-300">
                    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0">
                        {/* Login form */}
                        <div className="w-full min-h-[410px] md:h-full bg-white order-2 md:order-1">
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="p-0 px-0 md:px-12 lg:px-20 flex flex-col justify-start md:justify-center gap-10 h-full"
                            >
                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-center space-y-5"
                                >
                                    <h1 className="text-2xl font-semibold">
                                        Reset your password!
                                    </h1>
                                    <p className="font-medium">
                                        Hey, {role && role[0].toUpperCase() + role?.slice(1)} reset
                                        your password.
                                    </p>
                                </motion.div>

                                {/* form */}
                                <form onSubmit={handleSubmit} className="space-y-2">
                                    {/* Input for new password */}
                                    <motion.div
                                        className="space-y-2 relative"
                                        initial={{ opacity: 1, y: 0 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "password" : "text"}
                                                placeholder="Password"
                                                required
                                                autoComplete="off"
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                className="font-medium p-5 pl-9 border"
                                            />
                                            <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                        </div>
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
                                            className="text-sm font-medium"
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
                                                value={confirmPassword}
                                                onChange={(event) =>
                                                    setConfirmPassword(event.target.value)
                                                }
                                                className="font-medium p-5 pl-9 border"
                                            />
                                            <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                        </div>
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
                                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
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
                                            type="button"
                                            className="w-full h-11 bg-transparent hover:bg-transparent text-zin-900 shadow-none"
                                        >
                                            <div
                                                onClick={() => navigate(`/${role}/login`)}
                                                className="flex items-center gap-2"
                                            >
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
                                <div className="relative h-full">
                                    <div className=" w-full h-full  absolute top-0 left-0 bg-black/10"></div>
                                    <img
                                        src={bgImage}
                                        alt=""
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                            }
                            className="order-1 md:order-2 text-black"
                        />
                    </div>
                </div>
            )}
            {isMount === false && (
                <div className="relative h-screen w-full z-0 flex flex-col items-center justify-center p-5 space-y-5">
                    <h1 className="font-bold text-2xl">
                        Sorry, this page isn't available.
                    </h1>
                    <p className="text-center font-medium text-lg">
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
