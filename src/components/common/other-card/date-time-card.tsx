import { AnimatePresence, motion } from "framer-motion";
import PremiumCalendarCard from "./premium-calender-card";
import { useEffect, useState } from "react";
import DashboardCard from "./dashboard-card";
import CardHeader from "../data-toolbar/header";

// Date and Time Component
function DateAndTime() {
    // Time related states
    const [time, setTime] = useState(new Date());
    const [meridian, setMeridian] = useState(
        new Date().getHours() >= 12 ? "PM" : "AM"
    );

    // Convert to 12-hour format
    const formatNumber = (num: number) => String(num).padStart(2, "0");

    // Hour and minute
    const hours = formatNumber(((time.getHours() + 11) % 12) + 1);
    const minutes = formatNumber(time.getMinutes());

    const flipVariants = {
        initial: { rotateX: 90, opacity: 0 },
        animate: { rotateX: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { rotateX: -90, opacity: 0, transition: { duration: 0.3 } },
    };

    // Update time in every second
    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = new Date();

            //Update time and meridian
            setTime(newTime);

            setMeridian(newTime.getHours() >= 12 ? "PM" : "AM");
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardCard
            header={<CardHeader heading="Date & Time" />}
            content={
                <div className="relative h-full flex flex-col justify-between pt-10 gap-3">
                    {/* Premium calendar */}
                    <PremiumCalendarCard />

                    {/* Time Flipper */}
                    <div className="w-full flex flex-col justify-between items-start overflow-x-auto no-scrollbar">
                        <div className="flex justify-center items-center gap-1 text-foreground text-5xl font-bold">
                            {[hours[0], hours[1], "", minutes[0], minutes[1]].map(
                                (item, index) =>
                                    item ? (
                                        <div key={index} className="relative w-[91px] h-[91px]">
                                            {/* AnimatePresence triggers flip on change */}
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.div
                                                    key={`${index}-${item}`} // key must change when digit changes
                                                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-5 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 dark:bg-background border border-zinc-700 text-white shadow-md rounded-lg"
                                                    variants={flipVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                >
                                                    {item}
                                                </motion.div>
                                            </AnimatePresence>

                                            {/* AM/PM indicator */}
                                            {index === 0 && (
                                                <motion.p
                                                    className={`absolute z-30 ${meridian === "AM" ? "top-2" : "bottom-2"
                                                        } left-2 text-white text-[10px] font-semibold`}
                                                >
                                                    {meridian}
                                                </motion.p>
                                            )}
                                        </div>
                                    ) : (
                                        <span
                                            key={index}
                                            className="mx-2 flex flex-col items-center gap-3 justify-center"
                                        >
                                            <div className="h-1 w-1 bg-foreground rounded-full"></div>
                                            <div className="h-1 w-1 bg-foreground rounded-full"></div>
                                        </span>
                                    )
                            )}
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default DateAndTime;
