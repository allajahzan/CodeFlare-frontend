import { Keyboard, Link, Plus, Video } from "lucide-react";
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
import { type IThemeContext, ThemeContext } from "@/context/theme-context";
import { useMediaQuery } from "react-responsive";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

// Meet landing Component
function MeetLanding() {
    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    const isMobile = useMediaQuery({ maxWidth: 640 });
    // const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
    //   const isDesktop = useMediaQuery({ minWidth: 1025 })

    return (
        <div className="h-screen dotted-bg">
            <div className="flex flex-col h-full relative transition-all ">
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <div className="flex flex-col items-center flex-1 overflow-hidden">
                    {/* Grid */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-2 gap-0">
                        {/* Left side */}
                        <div className="flex flex-col justify-center items-center md:items-start gap-5 p-5 md:p-8 lg:p-16 xl:p-20">
                            {/* Headings */}
                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                className="text-foreground text-center md:text-start text-3xl md:text-4xl lg:text-[42px] font-medium "
                            >
                                Video calls and meetings for everyone
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                className="text-muted-foreground text-center md:text-start text-lg md:text-xl lg:text-2xl font-medium px-8 sm:px-32 md:px-0 md:pr-8 xl:pr-16"
                            >
                                Connect, collaborate, and celebrate from anywhere with CodeFlare
                                meet
                            </motion.p>

                            {/* Buttons */}
                            <form className="flex flex-col md:flex-col lg:flex-row items-center gap-3 mt-5 w-full px-0 sm:px-20 md:px-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                    className="shadow-md rounded-lg w-full lg:w-auto"
                                >
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                type="button"
                                                className="h-11 shadow-sm disabled:cursor-not-allowed w-full lg:w-auto"
                                            >
                                                <Video className="mr-2" /> New meeting
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="w-full lg:w-auto"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => console.log("Start Instant Meeting")}
                                                className="p-2"
                                            >
                                              <Plus className="w-5 h-5 text-foreground"/>  Start an instant meeting
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => console.log("Schedule a Meeting")}
                                                className="p-2"
                                            >
                                               <Link className="w-5 h-5 text-foreground"/>    Create a meeting for later
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>

                                <div className="flex w-full gap-3">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                        className="relative flex-1 shadow-sm rounded-lg"
                                    >
                                        <Input
                                            id="work"
                                            type="text"
                                            placeholder="Enter a code or link"
                                            autoComplete="off"
                                            required
                                            className="p-5 pl-9 h-11 text-foreground font-medium dark:border-customBorder-dark
                                           focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-background"
                                        />
                                        <Keyboard className="w-4 h-4 absolute left-3 top-[14px] text-muted-foreground" />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                        className="h-full flex items-center bg-muted rounded-lg"
                                    >
                                        <Button
                                            type="submit"
                                            className="h-11 w-20 sm:w-28 disabled:cursor-not-allowed bg-muted hover:bg-muted dark:bg-muted dark:hover:bg-muted text-foreground"
                                        >
                                            Join
                                        </Button>
                                    </motion.div>
                                </div>
                            </form>
                        </div>

                        {/* Right side */}
                        <motion.div
                            initial={{ opacity: 0, y: isMobile ? -30 : -30 }}
                            animate={{ opacity: 1, y: isMobile ? 0 : 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                            className="h-full flex items-center justify-center px-4 sm:px-6 relative -top-5 md:top-0"
                        >
                            <Carousel className="w-full max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg h-full flex items-center justify-center">
                                <CarouselContent className="h-full w-full flex items-center gap-0">
                                    <CarouselItem className="w-full flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={theme === "light" ? meet : meetWhite}
                                                className="w-24 md:28"
                                            />
                                            <p className="text-foreground font-medium text-xl md:text-2xl">
                                                Get a link you can share
                                            </p>
                                            <p className="text-muted-foreground text-center font-medium text-sm md:text-base px-10 md:px-12">
                                                Click new meeting to get a link you can send to people
                                                you want to meet with
                                            </p>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={theme === "light" ? secure : secireWhite}
                                                className="w-20 md:24"
                                            />
                                            <p className="text-foreground font-medium text-xl md:text-2xl">
                                                Your meeting is safe
                                            </p>
                                            <p className="text-muted-foreground text-center font-medium text-sm md:text-base px-10 md:px-12">
                                                No one can join the meeting unless invited or admitted
                                                by the host
                                            </p>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious className="duration-0 -left-2 sm:left-0" />
                                <CarouselNext className="duration-0 -right-2 sm:right-0" />
                            </Carousel>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeetLanding;
