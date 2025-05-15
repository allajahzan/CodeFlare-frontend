import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode;
}

// Carousal slider Component
function CarousalSlider({ children }: PropsType) {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-lg"
        >
            <CarouselContent>{children}</CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

export default CarousalSlider;
