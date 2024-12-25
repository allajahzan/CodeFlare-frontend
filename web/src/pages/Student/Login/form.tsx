import Input from "@/components/input/input";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

function Form() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-2 items-center justify-center p-6 relative h-full w-full bg-white/100 rounded-2xl shadow-custom ">
            {/* login form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full bg-white rounded-2xl"
            >
                <motion.div
                    className="p-8 flex flex-col justify-center gap-10 h-full"
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-center space-y-5">
                        <h1 className="text-2xl font-semibold">Student Login</h1>
                        <p className="text-base font-medium">
                            Hey, Enter your details to get sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Input
                                id="email"
                                type="text"
                                label="Email"
                                input=""
                                setInput={() => { }}
                            />
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    input=""
                                    setInput={() => { }}
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-6 w-6" />
                                    ) : (
                                        <Eye className="h-6 w-6" />
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 hover:bg-zinc-950 text-white rounded-lg h-12"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </motion.div>

            {/* carousal */}
            <div className="h-full w-full bg-zinc-100 rounded-2xl"></div>
        </div>
    );
}

export default Form;
