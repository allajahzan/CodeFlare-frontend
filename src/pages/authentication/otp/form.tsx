import Carousel from "@/components/animated/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "@/assets/images/loginImage4.jpg";
import { userApi } from "@/api/userApi";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import axios from "axios";

function Form() {
    const [submiting, setSubmiting] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Inputs
    const [otp, setOtp] = useState<string>("");

    const path = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    // Handle submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmiting(true);

        try {
            // Send request
            const resp = await axios.post(userApi.sendOtp + token, { otp });

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);

                    toast({ title: "Your accout has been verified." });

                    // Redirect to otp page
                }, 1000);
            }
        } catch (err: any) {
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
        <div className="relative z-0 p-5 pl-5 md:pl-0 h-full w-full lg:w-[80%] lg:h-[80%] bg-white rounded-2xl shadow-custom overflow-hidden transition-all duration-300">
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0">
                {/* Login form */}
                <div className="w-full min-h-[330px] md:h-full bg-white order-2 md:order-1">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="p-0 px-0 md:px-12 lg:px-20 flex flex-col justify-center gap-10 h-full"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center space-y-5"
                        >
                            <h1 className="text-2xl font-semibold">Enter the OTP!</h1>
                            <p className="font-medium">
                                Hey, {role && role[0].toUpperCase() + role?.slice(1)} enter the
                                OTP sent to your email
                            </p>
                        </motion.div>

                        {/* form */}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            {/* Input for otp */}
                            <motion.div
                                className="space-y-2 relative"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="OTP"
                                        required
                                        maxLength={6}
                                        minLength={6}
                                        onChange={(event) => setOtp(event.target.value)}
                                        className="font-medium p-5 pl-9 border-2"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
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
                                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {submiting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>

                {/* Carousal */}
                <Carousel
                    slides={slides}
                    image={
                        <img src={bgImage} alt="" className="object-cover h-full w-full" />
                    }
                />
            </div>
        </div>
    );
}

export default Form;
