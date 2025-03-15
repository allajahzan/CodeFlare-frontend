import { useEffect, useState } from "react";
import { Disc, Eye, List, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import IconButton from "@/components/ui/icon-button";
import ToolTip from "@/components/common/tooltip/tooltip";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Attendence Component
function Attendence() {
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    const [meridian, setMeridian] = useState(
        new Date().getHours() >= 12 ? "PM" : "AM"
    );

    // Redux
    const role = useSelector((state: stateType) => state.role);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = new Date();

            //Update time and meridian
            setTime(newTime);

            setMeridian(newTime.getHours() >= 12 ? "PM" : "AM");
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Convert to 12-hour format
    const formatNumber = (num: number) => String(num).padStart(2, "0");

    const hours = formatNumber(((time.getHours() + 11) % 12) + 1);
    const minutes = formatNumber(time.getMinutes());

    return (
        <div className="relative p-5 flex flex-col rounded-2xl w-full h-[400px] bg-background dark:bg-sidebar-background border shadow-sm">
            {/* Header */}
            <div className="w-full flex items-center gap-3">
                <p className="flex-1 text-base text-foreground font-semibold">
                    Attendence
                </p>
                <div
                    onClick={() => navigate(`/${role}/attendence`)}
                    className="p-2 bg-muted rounded-full cursor-pointer"
                >
                    <List className="w-4 h-4 text-foreground" />
                </div>
            </div>

            {/* Date */}
            <p className="absolute -translate-x-1/2 left-[22%] top-[27%] text-base text-foreground font-semibold">
                {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}
            </p>

            {/* Time Flipper */}
            <div
                // style={{ fontFamily: "Arial, sans-serif" }}
                className="flex-1 flex justify-center items-center text-foreground text-6xl font-bold"
            >
                {[hours[0], hours[1], "", minutes[0], minutes[1]].map((item, index) => {
                    return item ? (
                        // Time Card
                        <div key={index} className="relative">
                            {/* Old Number  */}
                            <motion.div
                                key={`old-${item}`}
                                className="absolute p-5 m-0.5 w-20 h-20 flex items-center justify-center bg-zinc-800 dark:bg-background border text-white shadow-sm rounded-lg"
                            >
                                {item}
                            </motion.div>

                            {/* New Number (Flipping In) */}
                            <div className="relative">
                                <motion.div
                                    key={`new-${item}`}
                                    className="p-5 m-0.5 w-20 h-20 flex items-center justify-center bg-zinc-800 dark:bg-background border text-white shadow-sm rounded-lg"
                                >
                                    {item}
                                </motion.div>
                                {index === 0 && (
                                    <motion.p
                                        className={`absolute z-30 ${meridian === "AM" ? "top-2" : "bottom-2"
                                            } left-2 text-white text-[10px] font-semibold`}
                                    >
                                        {meridian}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Dots
                        <span
                            key={index}
                            className="mx-2 flex flex-col items-center gap-3 justify-center"
                        >
                            <div className="h-1 w-1 bg-foreground rounded-full"></div>
                            <div className="h-1 w-1 bg-foreground rounded-full"></div>
                        </span>
                    );
                })}
            </div>

            {/* Sign your attendence */}
            <div className="w-full flex gap-3 items-center justify-center">
                <ToolTip
                    children={
                        <div className="bg-background rounded-lg">
                            <IconButton Icon={Play} />
                        </div>
                    }
                    text="SignIn"
                    side="left"
                />

                <ToolTip
                    children={
                        <div className="bg-background rounded-lg">
                            <IconButton Icon={Pause} />
                        </div>
                    }
                    text="Break"
                    side="left"
                />

                <ToolTip
                    children={
                        <div className="bg-background rounded-lg">
                            <IconButton Icon={Disc} />
                        </div>
                    }
                    text="Stop"
                    side="left"
                />

                <ToolTip
                    children={
                        <div className="bg-background rounded-lg">
                            <IconButton Icon={Eye} />
                        </div>
                    }
                    text="View"
                    side="left"
                />
            </div>
        </div>
    );
}

export default Attendence;
