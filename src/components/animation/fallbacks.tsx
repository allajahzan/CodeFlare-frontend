import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    rotation?: number;
    delay?: number;
    MainIcon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    SubIcon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text?: string;
    message?: string;
    className?: string;
    IconClassName?: string;
}

// OrbitingIcon Component
function OrbitingIcon({ delay, rotation, SubIcon }: PropsType) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: `rotate(${rotation}deg)`,
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    transformOrigin: "center",
                }}
            >
                <div
                    className="absolute p-2 bg-background border shadow-md rounded-lg"
                    style={{
                        transform: "translate(-50%, -50%)",
                        left: "0%",
                        top: "50%",
                    }}
                >
                    {SubIcon && <SubIcon className="w-3 h-3 text-muted-foreground" />}
                </div>
            </motion.div>
        </motion.div>
    );
}

// NotFoundOrbit Component
function NotFoundOrbit({ MainIcon, SubIcon, message, text }: PropsType) {
    return (
        <div className="relative h-full p-5 flex flex-col gap-7 items-center justify-center border shadow-sm rounded-2xl overflow-hidden">
            <div className="relative w-[185px] h-[185px]">
                {/* Inner orbit */}
                <div className="absolute inset-10 rounded-full border border-dashed border-muted-foreground/20">
                    <OrbitingIcon rotation={180} delay={0.3} SubIcon={SubIcon} />
                </div>

                {/* Inner orbit */}
                <div className="absolute inset-2 rounded-full border border-dashed border-muted-foreground/20">
                    <OrbitingIcon rotation={90} delay={0.5} SubIcon={SubIcon} />
                    <OrbitingIcon rotation={270} delay={0.7} SubIcon={SubIcon} />
                    <OrbitingIcon rotation={360} delay={0.9} SubIcon={SubIcon} />
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-background border-2 border-dashed rounded-full"
                    >
                        {MainIcon && <MainIcon className="w-5 h-5 text-muted-foreground" />}
                    </motion.div>
                </div>
            </div>

            {/* message */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <h3 className="text-base font-semibold">{text}</h3>
                <p className="text-muted-foreground font-medium">{message}</p>
            </motion.div>
        </div>
    );
}

// NotSelected Component
function NotSelected({
    MainIcon,
    message,
    text,
    className,
    IconClassName,
}: PropsType) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 items-center justify-center bg-white border shadow-sm rounded-2xl",
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-3 bg-background border-2 border-dashed rounded-full"
            >
                {MainIcon && (
                    <MainIcon
                        className={cn("w-5 h-5 text-muted-foreground", IconClassName)}
                    />
                )}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <h3 className="text-base font-semibold">{text}</h3>
                <p className="text-muted-foreground font-medium">{message}</p>
            </motion.div>
        </div>
    );
}

export { NotFoundOrbit, NotSelected };
