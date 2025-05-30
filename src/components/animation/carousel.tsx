import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Inteface for Props
interface PropsType {
    slides: { id: number; title: string; description: string }[];
    image?: React.ReactNode;
    className?: string;
}

// Carousel Component
function Carousel({ slides, image, className }: PropsType) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    let timer: any;

    const goToNextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        timer = setInterval(goToNextSlide, 3000);
        return () => clearInterval(timer);
    }, [goToNextSlide]);

    const goNext = () => {
        setCurrentSlide((prev: number) => {
            return prev + 1 === 3 ? 0 : prev + 1;
        });
        clearInterval(timer);
    };

    return (
        <div
            className={cn(
                "h-[260px] md:h-full w-full relative rounded-2xl shadow-md text-white",
                className
            )}
        >
            {/* Background Image */}
            {image}

            {/* slide Content */}
            <div className="absolute z-10 inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 12,
                            delay: 0.2,
                        }}
                        className="text-center px-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-base md:text-lg">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* navigation dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={goNext}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-muted-foreground/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;
