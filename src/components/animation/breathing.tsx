import { motion } from "framer-motion";

// Breathing Component
function Breathing() {
    return (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <svg
                className="absolute w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z"
                    initial={{ d: "M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z" }}
                    fill="#000"
                    opacity={0.05}
                    animate={{
                        d: [
                            "M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z",
                            "M0,0 Q50,30 100,0 V100 Q50,70 0,100 Z",
                            "M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z",
                        ],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </svg>
            {/* <div className="absolute w-full h-full bg-gradient-to-br from-black/50 via-black/0 to-black/50"></div> */}
        </div>
    );
}

export default Breathing;
