import { useContext, useEffect, useState } from "react";
import { Camera, Info, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkedInAction, stateType } from "@/redux/store";
import CheckInOutModal from "./modal-check-in-out";
import { Button } from "@/components/ui/button";
import AttendenceGuidlinesModal from "./modal-guidlines";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { IUserContext, UserContext } from "@/context/user-context";
import ToolTip from "@/components/common/tooltip/tooltip";
import WebCamModal from "./modal-web-cam";
import CardHeader from "@/components/common/data-toolbar/header";
import SmallIconButton from "@/components/ui/icon-button-small";
import hourglass from "@/assets/images/hourglass.png";
import { ISnapshotContext, useSnapshot } from "@/context/snapshot-context";

// Attendence Component
function Attendence() {
    // Fetching
    const [fetching, setFetching] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    // Modal
    const [openWebCamModal, setOpenWebCamModal] = useState<boolean>(false);
    const [openGuidlinesModal, setOpenGuidlinesModal] = useState<boolean>(false);

    const [timeSinceCheckIn, setTimeSinceCheckIn] =
        useState<string>("0h : 0m: 0s");

    // Redux
    const role = useSelector((state: stateType) => state.role);
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    const dispatch = useDispatch();

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Snapshot context
    const { snapshotMessage, setSnapshotMessage } =
        useSnapshot() as ISnapshotContext;

    // Timer
    let interval: NodeJS.Timer | null = null;

    const timer = (checkIn: string, date: Date) => {
        console.log(checkIn, date);
        const [hour, minute] = checkIn.split(":").map(Number);
        const checkInTime = new Date(date);
        checkInTime.setHours(hour, minute, 0, 0);

        interval = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - checkInTime.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeSinceCheckIn(`${hours}h : ${minutes}m : ${seconds}s`);
        }, 1000);
    };

    useEffect(() => {
        const checkCheckIn = async () => {
            try {
                setFetching(true);
                setLoading(true);

                const resp = await fetchData(
                    ApiEndpoints.ATTENDENCE + `?userId=${user?._id}`,
                    role
                );

                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    if (data.checkIn && !data.checkOut) {
                        dispatch(checkedInAction(true));
                        setLoading(false);
                    } else if (!data.checkIn) {
                        dispatch(checkedInAction(false));
                        setLoading(false);
                    }

                    // Set time interval if checked-in
                    if (data.checkIn) {
                        timer(data.checkIn, data.date);
                    }
                }

                setFetching(false);
            } catch (err: unknown) {
                if ((err as { status: number; msg: string }).status !== 404) {
                    handleCustomError(err);
                }
                setFetching(false);
            }
        };

        checkCheckIn();

        return () => {
            if (interval) {
                clearInterval(interval as any);
            }
        };
    }, []);

    return (
        <div className="relative h-full flex flex-col justify-between">
            <CardHeader
                heading="Attendence"
                children={
                    <div className="flex items-center">
                        {/* Info about attedence */}
                        <ToolTip
                            text="Guidlines"
                            side="left"
                            children={
                                <SmallIconButton Icon={Info} className="dark:bg-transparent" />
                            }
                            action={() => setOpenGuidlinesModal(true)}
                        />
                    </div>
                }
            />

            {/* <h1>You can mark your attendence heres</h1> */}

            {/* <div className="h-full flex flex-col"> */}
            {/* Snapshot Message */}
            <ToolTip
                side="bottom"
                text={snapshotMessage || "Time"}
                action={() => setOpenWebCamModal(true)}
                MainClassName="w-full cursor-pointer"
                children={
                    <div className="w-full flex flex-col gap-2">
                        {/* <p className="font-medium text-sm text-foreground">
                              Time since checked-in
                            </p> */}
                        <div className="flex items-center">
                            <img className="w-16 z-10" src={hourglass} />
                            <div className="w-full relative right-1 p-2 flex items-center justify-between rounded-r-lg bg-background">
                                {snapshotMessage && (
                                    <div className="absolute -top-1 -right-1">
                                        {/* Ping animation */}
                                        <span className="absolute h-5 w-5 rounded-full bg-red-800 opacity-75 animate-ping"></span>

                                        {/* Notification count */}
                                        <div className="relative flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-800 rounded-full">
                                            <Camera className="w-3 h-3" />
                                        </div>
                                    </div>
                                )}

                                <div className="w-full flex items-center justify-center space-x-2 text-foreground">
                                    {/* <Clock className="w-5 h-5"/> */}
                                    <span className="text-sm font-semibold">
                                        {timeSinceCheckIn}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Sign your attendance - bottom right */}
            <div className="w-full flex gap-3 items-center justify-end">
                <div className="relative w-full">
                    {!loading && (
                        <CheckInOutModal
                            children={
                                <div className="w-full bg-background rounded-lg">
                                    <Button
                                        variant="default"
                                        type="submit"
                                        className="w-full shadow-md disabled:cursor-not-allowed"
                                    >
                                        {isCheckedIn ? "Check-out" : "Check-in"}
                                    </Button>
                                </div>
                            }
                            timer={timer}
                        />
                    )}

                    {loading && (
                        <div className="relative cursor-not-allowed">
                            <Button
                                variant="default"
                                type="submit"
                                disabled={loading}
                                className="w-full shadow-md disabled:cursor-not-allowed"
                            >
                                {fetching ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : (
                                    "Checked In & Out"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Web cam */}
            {snapshotMessage && (
                <WebCamModal
                    open={openWebCamModal}
                    setOpen={setOpenWebCamModal}
                    message={snapshotMessage}
                    setSnapshotMessage={setSnapshotMessage}
                />
            )}

            {/* Guidlines modal */}
            <AttendenceGuidlinesModal
                open={openGuidlinesModal}
                setOpen={setOpenGuidlinesModal}
            />
            {/* </div> */}
        </div>
    );
}

export default Attendence;
