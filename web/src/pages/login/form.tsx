import Carousel from "@/components/animated/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

function Form() {
    const [showPassword, setShowPassword] = useState(false);
    const [submiting, setsubmiting] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    // inputs
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const path = useLocation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setsubmiting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setsubmiting(false);
    };

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

    useLayoutEffect(() => {
        setRole(path.pathname.split("/")[1]);
    }, [path]);

    return (
        <div className="relative z-0 p-5 pr-5 md:pr-0 h-full lg:h-[80%] w-full lg:w-[80%] bg-white rounded-2xl shadow-custom overflow-hidden">
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0">
                {/* carousal */}
                <Carousel slides={slides} />

                {/* login form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full h-full bg-white"
                >
                    <div className="p-0 px-0 md:px-12 lg:px-20 flex flex-col justify-center gap-10 h-full">
                        <div className="text-center space-y-5">
                            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
                            <p className="font-medium">
                                Hey, {role && role[0].toUpperCase() + role?.slice(1)} sign in to
                                your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="font-medium p-5 pl-9"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-2 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type={showPassword ? "password" : "email"}
                                        placeholder="Password"
                                        required
                                        className="font-medium p-5 pl-9"
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

                            {role !== "admin" && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-end font-medium cursor-pointer"
                                >
                                    Forgot Password?
                                </motion.p>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={submiting}
                                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submiting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "SignIn"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Form;
