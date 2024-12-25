import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../../assets/images/loginImage4.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface propType {
    slides: { id: number; title: string; description: string }[];
}

function Carousel({ slides }: propType) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const goToNextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(goToNextSlide, 5000);
        return () => clearInterval(timer);
    }, [goToNextSlide]);

    const goNext = () => {
        setCurrentSlide((prev:number)=>{
            return (prev+1) === 3? 0 : prev+1
        });
    };

    const goBack = () => {
        setCurrentSlide((prev:number)=>{
            return (prev-1) === -1? 2 : prev-1
        });
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="h-full w-full relative overflow-hidden rounded-2xl"
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
                <ChevronLeft onClick={goBack} className="text-white h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] cursor-pointer"/>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-center px-12"
                    >
                        <h2 className="text-2xl sm:text-3xl text-white font-bold mb-4">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-sm sm:text-base text-white">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
                <ChevronRight onClick={goNext} className="text-white h-10 w-10 absolute right-0 top-[50%] -translate-y-[50%] cursor-pointer"/>
            </div>

            {/* navigation dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={goNext}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-zinc-900"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;
