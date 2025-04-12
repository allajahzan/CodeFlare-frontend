import { useMemo } from "react";
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
import "./floating-background.css";
import GridPattern from "./grid-pattern";

interface PropsType {
    children: React.ReactNode;
}

// Floating Background Component
function FloatingBackground({ children }: PropsType) {
    const floatingIcons = useMemo(
        () => [
            {
                icon: <Code className="w-8 h-8 text-foreground" />,
                animation: "icon-code",
            },
            {
                icon: <Laptop className="w-8 h-8 text-foreground" />,
                animation: "icon-laptop",
            },
            {
                icon: <Terminal className="w-8 h-8 text-foreground" />,
                animation: "icon-terminal",
            },
            {
                icon: <Calendar className="w-8 h-8 text-foreground" />,
                animation: "icon-calender",
            },
            {
                icon: <AlarmClock className="w-8 h-8 text-foreground" />,
                animation: "icon-alarm",
            },
            {
                icon: <ChartLine className="w-8 h-8 text-foreground" />,
                animation: "icon-chart",
            },
            {
                icon: <ListCheck className="w-8 h-8 text-foreground" />,
                animation: "icon-list",
            },
            {
                icon: <MessageCircleMore className="w-8 h-8 text-foreground" />,
                animation: "icon-chat",
            },
        ],
        []
    );

    return (
        <div className="h-screen bg-background flex flex-col items-center justify-center overflow-hidden transition-all duration-100 relative">
            {/* animated background elements */}
            <div className="fixed inset-0 overflow-hidden">
                {/* binary rain effect */}
                {/* <div className="absolute inset-0 opacity-[0.2]">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-xs font-mono"
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
                </div> */}

                {/* floatin tech icons */}
                {floatingIcons.map((item, index) => (
                    <div
                        key={`floating-icon-${index}`}
                        className="absolute z-50 transition-transform duration-200 ease-in-out hover:scale-110 p-5 rounded-2xl 
                        bg-background border-2 border-white dark:border-customBorder shadow-custom"
                        style={{
                            animation: `${item.animation} 30s infinite ease-in-out alternate`,
                        }}
                    >
                        <div className="opacity-[0.2]">{item.icon}</div>
                    </div>
                ))}

                {/* grid pattern */}
                <GridPattern/>
            </div>

            {/* main content */}
            {children}
        </div>
    );
}

export default FloatingBackground;
