import { useEffect, useState } from "react";
import { Info, List } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkedInAction, stateType } from "@/redux/store";
import CheckedInOutModal from "./check-in-out-modal";
import { Button } from "@/components/ui/button";
import AttendenceInfoModal from "./attendence-info-modal";
// import * as faceapi from "face-api.js";
// import * as tf from "@tensorflow/tfjs";
// import { drawFaceLandmarks } from "@/utils/face-landmark";
// import { generateStableFaceId } from "@/utils/generate-uniqueId";

// Attendence Component
function Attendence() {
    // Time related states
    const [time, setTime] = useState(new Date());
    const [meridian, setMeridian] = useState(
        new Date().getHours() >= 12 ? "PM" : "AM"
    );

    // Navigate
    const navigate = useNavigate();

    // Redux
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    const dispatch = useDispatch();

    // Check last checked-in-date and clear isCheckedIn if needed
    const lastCheckedInDate = localStorage.getItem("lastCheckedInDate");
    if (lastCheckedInDate !== new Date().toDateString()) {
        dispatch(checkedInAction(false));
        localStorage.setItem("isCheckedIn", "0");
    }

    // Webcam states
    // const [webCamOpen, setWebCamOpen] = useState<boolean>(false);

    // Video Ref
    // const videoRef = useRef<HTMLVideoElement | null>(null);

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

    // Hour and minute
    const hours = formatNumber(((time.getHours() + 11) % 12) + 1);
    const minutes = formatNumber(time.getMinutes());

    return (
        <div className="relative p-5 flex flex-col rounded-2xl w-full h-[400px] bg-background dark:bg-sidebar-background border shadow-sm">
            {/* Header */}
            <div className="w-full flex items-center gap-3">
                <p className="flex-1 text-lg text-foreground font-semibold">
                    Attendence
                </p>

                {/* Info about attedence */}
                <AttendenceInfoModal
                    children={
                        <div className="p-2 bg-muted rounded-full cursor-pointer">
                            <Info className="w-4 h-4 text-foreground" />
                        </div>
                    }
                />

                {/* Attendence calender */}
                <div
                    onClick={() => navigate(`/${role}/attendence`)}
                    className="p-2 bg-muted rounded-full cursor-pointer"
                >
                    <List className="w-4 h-4 text-foreground" />
                </div>
            </div>

            {/* Date */}
            <p className="absolute -translate-x-1/2 left-[22%] top-[30%] text-base text-foreground font-medium">
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
                                className="absolute p-5 m-0.5 w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-600 dark:bg-background border text-white shadow-sm rounded-lg"
                            >
                                {item}
                            </motion.div>

                            {/* New Number (Flipping In) */}
                            <div className="relative">
                                <motion.div
                                    key={`new-${item}`}
                                    className="p-5 m-0.5 w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-600 dark:bg-background border text-white shadow-sm rounded-lg"
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
            <div className="w-full flex gap-3 items-center justify-end">
                {/* CheckOut */}
                <CheckedInOutModal
                    children={
                        <div className="bg-background rounded-lg">
                            <Button>{isCheckedIn ? "Check-out" : "Check-in"}</Button>
                        </div>
                    }
                />

                {/* View */}
                {/* <ToolTip
                    children={
                        <div className="bg-background rounded-lg">
                            <IconButton Icon={Eye} />
                        </div>
                    }
                    text="View"
                    side="left"
                /> */}
            </div>

            {/* Web cam */}
            {/* <WebCamModal
                videoRef={videoRef}
                webCamOpen={webCamOpen}
                setWebCamOpen={setWebCamOpen}
            /> */}
        </div>
    );
}

export default Attendence;
