import { Keyboard, Video } from "lucide-react";
import Navbar from "../common/navbar/navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import meet from "@/assets/images/meet.svg";
import meetWhite from "@/assets/images/meet-white.svg";
import secure from "@/assets/images/secure.svg";
import secireWhite from "@/assets/images/secure-white.svg";
import { useContext } from "react";
import { IThemeContext, ThemeContext } from "@/context/theme-context";

// Meet Component
function Meet() {
    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    return (
        <div className="h-screen dotted-bg">
            <div className="flex flex-col h-full relative transition-all">
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2">
                        {/* Left side */}
                        <div className="flex flex-col justify-center gap-3 p-24">
                            {/* Headings */}
                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                className="text-foreground text-5xl font-medium leading-tight"
                            >
                                Video calls and meetings for everyone
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                className="text-muted-foreground font-medium text-2xl pr-10"
                            >
                                Connect, collaborate, and celebrate from anywhere with CodeFlare
                                meet
                            </motion.p>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 mt-5 pr-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3, duration: 0.3, ease: "easeOut" }}
                                >
                                    <Button className="h-11 shadow-md disabled:cursor-not-allowed">
                                        <Video /> New meeting
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.4, duration: 0.3, ease: "easeOut" }}
                                    className="relative flex-1 shadow-sm"
                                >
                                    <Input
                                        id="work"
                                        type="text"
                                        placeholder="Enter a code or link"
                                        autoComplete="off"
                                        className="p-5 pl-9  h-11 text-foreground font-medium
                                       focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-background"
                                    />
                                    <Keyboard className="w-4 h-4 absolute left-3 top-[14px] text-muted-foreground" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5, duration: 0.3, ease: "easeOut" }}
                                    className="h-full px-8 flex items-center bg-muted rounded-lg shadow-sm"
                                >
                                    <p className="text-foreground font-medium text-base">Join</p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right side */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                            className="h-full flex items-center justify-center"
                        >
                            <Carousel className="w-full max-w-lg h-full flex items-center justify-center">
                                <CarouselContent className="h-full w-full flex items-center gap-0">
                                    <CarouselItem className="w-full flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={theme === "light" ? meet : meetWhite}
                                                className="w-28"
                                            />
                                            <p className="text-foreground font-medium text-2xl">
                                                Get a link you can share
                                            </p>
                                            <p className="text-muted-foreground text-center font-medium text-base px-10">
                                                Click new meeting to get a link you can send to people
                                                you want to meet with
                                            </p>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={theme === "light" ? secure : secireWhite}
                                                className="w-24"
                                            />
                                            <p className="text-foreground font-medium text-2xl">
                                                Your meeting is safe
                                            </p>
                                            <p className="text-muted-foreground text-center font-medium text-base px-10">
                                                No one can join the meeting unless invited or admitted
                                                by the host
                                            </p>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious className="duration-0" />
                                <CarouselNext className="duration-0" />
                            </Carousel>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="w-full"> het allaj </div>
                </div>
            </div>
        </div>
    );
}

export default Meet;
