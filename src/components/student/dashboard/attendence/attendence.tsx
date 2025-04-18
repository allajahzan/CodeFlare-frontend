import { useContext, useEffect, useState } from "react";
import { CalendarClock, Info, Loader2, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkedInAction, stateType } from "@/redux/store";
import CheckedInOutModal from "./check-in-out-modal";
import { Button } from "@/components/ui/button";
import AttendenceInfoModal from "./guidlines-modal";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { IUserContext, UserContext } from "@/context/user-context";
import ToolTip from "@/components/common/tooltip/tooltip";
import { ISnapshotContext, SnapshotContext } from "@/context/snapshot-context";
import WebCamModal from "./web-cam-modal";
import { Badge } from "@/components/ui/badge";
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

    // Fetching
    const [fetching, setFetching] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    // Modal
    const [open, setOpen] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    const dispatch = useDispatch();

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Snapshot context
    const { setSnapshotMessage, snapshotMessage } = useContext(
        SnapshotContext
    ) as ISnapshotContext;

    // Check weather student checkedIn or not
    useEffect(() => {
        const checkCheckIn = async () => {
            try {
                setFetching(true);
                setLoading(true);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.ATTENDENCE + `?userId=${user?._id}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update isCheckedIn
                    if (data.checkIn && !data.checkOut) {
                        dispatch(checkedInAction(true));
                        setLoading(false);
                    } else if (!data.checkIn) {
                        dispatch(checkedInAction(false));
                        setLoading(false);
                    }

                    setFetching(false);
                }
            } catch (err: unknown) {
                // Not on 404
                if ((err as { status: number; msg: string }).status !== 404) {
                    handleCustomError(err);
                    setLoading(false);
                }
                setFetching(false);
            }
        };

        checkCheckIn();
    }, []);

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
                <ToolTip
                    text="Guidlines"
                    side="left"
                    children={
                        <AttendenceInfoModal
                            children={
                                <div className="p-2 bg-muted rounded-full cursor-pointer">
                                    <Info className="w-4 h-4 text-foreground" />
                                </div>
                            }
                        />
                    }
                />

                {/* Attendence calender */}
                <ToolTip
                    text="Calender"
                    side="left"
                    children={
                        <div
                            onClick={() => navigate(`/${role}/attendence`)}
                            className="p-2 bg-muted rounded-full cursor-pointer"
                        >
                            <CalendarClock className="w-4 h-4 text-foreground" />
                        </div>
                    }
                />
            </div>

            <div className="relative flex-1 h-full flex flex-col pt-14 gap-3">
                {/* Date top-left */}
                <p className="text-base text-foreground font-semibold">
                    {new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>

                {/* Time Flipper */}
                <div className="h-full flex flex-col justify-between items-center">
                    <div className="flex justify-center items-center text-foreground text-6xl font-bold">
                        {[hours[0], hours[1], "", minutes[0], minutes[1]].map(
                            (item, index) =>
                                item ? (
                                    <div key={index} className="relative">
                                        {/* Old Number */}
                                        <motion.div
                                            key={`old-${item}`}
                                            className="absolute p-5 m-0.5 w-[92px] h-[92px] flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 dark:bg-background border text-white shadow-md rounded-lg"
                                        >
                                            {item}
                                        </motion.div>

                                        {/* New Number */}
                                        <div className="relative">
                                            <motion.div
                                                key={`new-${item}`}
                                                className="p-5 m-0.5 w-[92px] h-[92px] flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 dark:bg-background border text-white shadow-md rounded-lg"
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

                    {/* Snapshot Message */}
                    {snapshotMessage && isCheckedIn &&(
                        <ToolTip
                            text={snapshotMessage}
                            action={() => setOpen(true)}
                            MainClassName="w-full"
                            children={
                                <div className="w-full">
                                    <div className="h-11 px-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
                                        <div className="flex items-center space-x-2">
                                            <TriangleAlert className="h-5 w-5 text-red-800 dark:text-red-600" />
                                            <span className="text-sm font-medium text-red-800 dark:text-red-600">
                                                Send snapshot
                                            </span>
                                        </div>
                                        <Badge className="bg-red-600/20 text-red-800 dark:text-red-600 hover:bg-red-200 rounded-full shadow-none duration-0">
                                            Required
                                        </Badge>
                                    </div>
                                </div>
                            }
                        />
                    )}
                </div>

                {/* Sign your attendance - bottom right */}
                <div className="mt-auto w-full flex gap-3 items-center justify-end">
                    <div className="relative w-full">
                        {!loading && (
                            <CheckedInOutModal
                                children={
                                    <div className="w-full bg-background rounded-lg">
                                        <Button
                                            variant="default"
                                            type="submit"
                                            disabled={loading}
                                            className="h-11 w-full shadow-md disabled:cursor-not-allowed"
                                        >
                                            {fetching ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Loading...
                                                </div>
                                            ) : isCheckedIn ? (
                                                "Check-out"
                                            ) : (
                                                "Check-in"
                                            )}
                                        </Button>
                                    </div>
                                }
                            />
                        )}

                        {loading && (
                            <div className="relative cursor-not-allowed">
                                <Button
                                    variant="default"
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 w-full shadow-md disabled:cursor-not-allowed"
                                >
                                    {fetching ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </div>
                                    ) : isCheckedIn ? (
                                        "Check-out"
                                    ) : (
                                        "Check-in"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Web cam */}
            {snapshotMessage && (
                <WebCamModal
                    open={open}
                    setOpen={setOpen}
                    message={snapshotMessage}
                    setSnapshotMessage={setSnapshotMessage}
                />
            )}
        </div>
    );
}

export default Attendence;
