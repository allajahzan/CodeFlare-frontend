import { motion } from "framer-motion";
import { LucideProps, Plus } from "lucide-react";

interface PropsType {
    rotation?: number;
    delay?: number;
    Icon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text?: string;
    message?: string;
}
function OrbitingIcon({ delay, rotation }: PropsType) {
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
                    <Plus className="w-3 h-3 text-muted-foreground " />
                </div>
            </motion.div>
        </motion.div>
    );
}

function NotFoundOrbit({ Icon, message, text }: PropsType) {
    return (
        <div className="relative h-full p-5 flex flex-col gap-5 items-center justify-center border shadow-md rounded-2xl overflow-hidden">
            <div className="relative w-[181px] h-[181px]">
                {/* Inner orbit */}
                <div className="absolute inset-10 rounded-full border border-dashed border-muted-foreground/20">
                    <OrbitingIcon rotation={180} delay={0.3} />
                </div>

                {/* Inner orbit */}
                <div className="absolute inset-2 rounded-full border border-dashed border-muted-foreground/20">
                    <OrbitingIcon rotation={90} delay={0.5} />
                    <OrbitingIcon rotation={270} delay={0.7} />
                    <OrbitingIcon rotation={360} delay={0.9} />
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-background border-2 border-dashed rounded-full"
                    >
                        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                    </motion.div>
                </div>
            </div>

            {/* message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <h3 className="text-xl font-semibold">{text}</h3>
                <p className="text-muted-foreground font-medium">{message}</p>
            </motion.div>
        </div>
    );
}

export default NotFoundOrbit;
