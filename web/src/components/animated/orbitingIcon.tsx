import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface PropsType {
    rotation: number;
    delay: number;
}
function orbitingIcon({ delay, rotation }: PropsType) {
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
                    className="absolute p-2 bg-background border rounded-lg shadow-sm"
                    style={{
                        transform: "translate(-50%, -50%)",
                        left: "0%",
                        top: "50%",
                    }}
                >
                    <Plus className="w-3 h-3 text-muted-foreground" />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default orbitingIcon;
