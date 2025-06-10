import { useContext, useEffect, useState } from "react";
import { Info, Loader2, TriangleAlert } from "lucide-react";
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
import { ISnapshotContext, SnapshotContext } from "@/context/snapshot-context";
import WebCamModal from "./modal-web-cam";
import CardHeader from "@/components/common/data-toolbar/header";
import SmallIconButton from "@/components/ui/icon-button-small";

// Attendence Component
function Attendence() {
    // Fetching
    const [fetching, setFetching] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    // Modal
    const [openWebCamModal, setOpenWebCamModal] = useState<boolean>(false);
    const [openGuidlinesModal, setOpenGuidlinesModal] = useState<boolean>(false);

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

                    // Update isCheckedIn state in redux
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
                }
                setFetching(false);
            }
        };

        checkCheckIn();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <CardHeader
                heading="Attendence"
                children={
                    <div className="flex items-center gap-3">
                        {/* Info about attedence */}
                        <ToolTip
                            text="Guidlines"
                            side="left"
                            children={
                                <SmallIconButton Icon={Info} className="bg-zinc-200 dark:bg-muted"/>
                            }
                            action={() => setOpenGuidlinesModal(true)}
                        />

                        {/* Attendence calender */}
                        {/* <ToolTip
                            text="Calender"
                            side="left"
                            children={
                                <div
                                    onClick={() => navigate(`/${role}/attendance`)}
                                    className="p-2 bg-muted rounded-full cursor-pointer"
                                >
                                    <CalendarClock className="w-4 h-4 text-foreground" />
                                </div>
                            }
                        /> */}
                    </div>
                }
            />

            {/* <h1>You can mark your attendence heres</h1> */}

            <div className="h-full relative flex flex-col justify-end gap-3">
                {/* Snapshot Message */}
                {snapshotMessage && (
                    <ToolTip
                        side="bottom"
                        text={snapshotMessage}
                        action={() => setOpenWebCamModal(true)}
                        MainClassName="w-full cursor-pointer"
                        children={
                            <div className="w-full">
                                <div className="px-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center space-x-2">
                                        <TriangleAlert className="h-5 w-5 text-red-800 dark:text-red-600" />
                                        <span className="text-sm font-medium text-red-800 dark:text-red-600">
                                            Send snapshot
                                        </span>
                                    </div>
                                    {/* <Badge className="bg-red-600/20 text-red-800 dark:text-red-600 hover:bg-red-200 rounded-full shadow-none duration-0">
                                        Required
                                    </Badge> */}
                                </div>
                            </div>
                        }
                    />
                )}

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
                                            {isCheckedIn ? (
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
            </div>
        </div>
    );
}

export default Attendence;
