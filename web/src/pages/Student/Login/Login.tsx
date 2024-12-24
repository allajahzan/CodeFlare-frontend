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

function LoginPageStudent() {
    // Memoize the floating icons to prevent rerenders
    const floatingIcons = useMemo(
        () => [
            { icon: <Code className="w-24 h-24" />, delay: 0, x: 10, y: 600 },
            { icon: <Laptop className="w-24 h-24" />, delay: 0, x: 300, y: 100 },
            { icon: <Terminal className="w-24 h-24" />, delay: 0, x: 1400, y: 600 },
            { icon: <Database className="w-24 h-24" />, delay: 0, x: 1400, y: 100 },
            { icon: <Calendar className="w-24 h-24" />, delay: 0, x: 100, y: 100 },
            { icon: <AlarmClock className="w-24 h-24" />, delay: 0, x: 100, y: 500 },
        ],
        []
    ); // Empty dependency array ensures this is created only once

    return (
        <div className="h-screen bg-zinc-0 flex flex-col overflow-hidden relative px-60 py-20">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Binary Rain Effect */}
                <div className="absolute inset-0 opacity-[.2]">
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
                    <motion.div
                        key={`floating-icon-${index}`}
                        className="absolute  opacity-[.2]"
                        initial={{
                            x: item.x * window.innerWidth,
                            y: item.y * window.innerHeight,
                            scale: 0.5,
                        }}
                        animate={{
                            x: [
                                item.x,
                                Math.random() * window.innerWidth + Math.random() * 200 - 100,
                                item.x,
                            ],
                            y: [
                                item.y,
                                Math.random() * window.innerHeight + Math.random() * 200 - 100,
                                item.y,
                            ],
                            rotate: [0, 180, 360, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            delay: 0,
                            ease: "linear",
                        }}
                        style={{
                            width: 40 + Math.random() * 40,
                            height: 40 + Math.random() * 40,
                        }}
                    >
                        {item.icon}
                    </motion.div>
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
