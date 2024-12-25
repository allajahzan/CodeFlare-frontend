import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Code,
    Laptop,
    Terminal,
    AlarmClock,
    Calendar,
    ChartLine,
    MessageCircleMore,
    ListCheck,
} from "lucide-react";
import Form from "./form";
import "./animation.css";

function LoginPageStudent() {
    const floatingIcons = useMemo(
        () => [
            { icon: <Code className="w-10 h-10" />, animation: "icon-code" },
            { icon: <Laptop className="w-10 h-10" />, animation: "icon-laptop" },
            { icon: <Terminal className="w-10 h-10" />, animation: "icon-terminal" },
            { icon: <Calendar className="w-10 h-10" />, animation: "icon-calender" },
            { icon: <AlarmClock className="w-10 h-10" />, animation: "icon-alarm" },
            { icon: <ChartLine className="w-10 h-10" />, animation: "icon-chart" },
            { icon: <ListCheck className="w-10 h-10" />, animation: "icon-list" },
            {
                icon: <MessageCircleMore className="w-10 h-10" />,
                animation: "icon-chat",
            },
        ],
        []
    );

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden relative px-40 py-20">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden">
                {/* Binary Rain Effect */}
                <div className="absolute inset-0 opacity-[0.2]">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute hidden text-black text-xs font-mono"
                            initial={{ y: -100, x: Math.random() * window.innerWidth }}
                            animate={{ y: window.innerHeight + 100 }}
                            transition={{
                                duration: 10 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 5,
                            }}
                        >
                            <p className="text-2xl">{Math.random() > 0.5 ? "1" : "0"}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Floating Tech Icons */}
                {floatingIcons.map((item, index) => (
                    <div
                        key={`floating-icon-${index}`}
                        className="absolute opacity-[1] transition-transform duration-200 ease-in-out hover:scale-110 p-5 bg-white rounded-2xl shadow-custom"
                        style={{
                            animation: `${item.animation} 30s infinite ease-in-out alternate`,
                        }}
                    >
                        <div className="opacity-[1]">{item.icon}</div>
                    </div>
                ))}

                {/* Grid Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-[0.2]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px),
              linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* login form */}
            <Form />
        </div>
    );
}

export default LoginPageStudent;
