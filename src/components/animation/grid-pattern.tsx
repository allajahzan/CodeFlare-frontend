import { motion } from "framer-motion";

// Grid pattern Component
function GridPattern() {
    return (
        <motion.div
            className="absolute inset-0 opacity-[0.1] bg-[length:50px_50px] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] 
        dark:bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]"
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
    );
}

export default GridPattern;
