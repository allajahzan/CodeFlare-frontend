import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../../assets/images/loginImage4.jpg";

interface propType {
    slides : {id:number, title: string, description: string}[]
}

function Carousel({slides}:propType) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToNextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(goToNextSlide, 5000);
        return () => clearInterval(timer); 
    }, [goToNextSlide]);

    const goToSlide = (index:number) => {
        setCurrentSlide(index);
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="h-full w-full relative overflow-hidden"
        >
            {/* SVG Animated Overlay */}
            {/* <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                        d="M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z"
                        fill="#f4f4f5"
                        initial={{
                            d: "M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z",
                        }}
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
            </div> */}

            {/* slide Content */}
            <div className="relative h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="text-center px-12"
                    >
                        <h2 className="text-3xl text-white font-bold mb-4">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-white text-base">{slides[currentSlide].description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* navigation dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentSlide ? "bg-white" : "bg-zinc-900"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;
