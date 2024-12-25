import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Code,
    Laptop,
    Terminal,
    Database,
    AlarmClock,
    Calendar,
} from "lucide-react";
import Form from "./form";
import "./animation.css";

function LoginPageStudent() {
    // Memoize the floating icons to prevent rerenders
    const floatingIcons = useMemo(
        () => [
            { icon: <Code className="w-20 h-20" />, animation: "icon-code" },
            { icon: <Laptop className="w-20 h-20" />, animation: "icon-laptop" },
            { icon: <Terminal className="w-24 h-24" />, animation: "icon-terminal" },
            // { icon: <Database className="w-24 h-24" />, delay: 0, x: 1400, y: 100 },
            { icon: <Calendar className="w-24 h-24" />, animation : 'icon-calender' },
            { icon: <AlarmClock className="w-24 h-24" />, animation : 'icon-alarm' },
        ],
        []
    ); // Empty dependency array ensures this is created only once

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden relative px-40 py-20">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden">
                {/* Binary Rain Effect */}
                <div className="absolute hidden inset-0 opacity-[.2]">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-black text-xs font-mono"
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
                        className="absolute opacity-[1]"
                        style={{
                            animation: `${item.animation} 30s infinite ease-in-out alternate`,
                        }}
                    >
                        {item.icon}
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
