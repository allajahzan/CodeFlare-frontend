import InfoCard from "@/components/common/other-cards/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IAttendence } from "@/types/attendence";
import { convertTo12HourFormat } from "@/utils/time-converter";
import {
    Camera,
    Check,
    ChevronDown,
    FileSpreadsheetIcon,
    Hourglass,
    Loader2,
    LogIn,
    LogOut,
    LucideCheckCircle2,
} from "lucide-react";
import SnapshotsModal from "./snapshots-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleCustomError } from "@/utils/error";
import { patchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { stateType } from "@/redux/store";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import ViewReasonModal from "./view-reason-modal";
import SubmitReasonModal from "./submit-reason-modal";
import { Button } from "@/components/ui/button";

// Interface for Props
interface PropsType {
    setAttendences: React.Dispatch<React.SetStateAction<[] | IAttendence[]>>;
    selectedAttendence: IAttendence;
    setSelectedAttendence: React.Dispatch<
        React.SetStateAction<IAttendence | null>
    >;
}
// Attendence Details Component
function AttendenceDetails({
    setAttendences,
    selectedAttendence,
    setSelectedAttendence,
}: PropsType) {
    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Status state
    const [status, setStatus] = useState<
        "Pending" | "Present" | "Absent" | "Late" | ""
    >("");

    // Reason submit modal states
    const [open, setOpen] = useState<boolean>(false);

    // Requesting states
    const [updating, setUpdating] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);
    const [marking, setMarking] = useState<boolean>(false);

    // Handle status change
    const handleStatusChange = (
        newStatus: "Pending" | "Present" | "Absent" | "Late"
    ) => {
        if (newStatus === "Absent" || newStatus === "Late") {
            setOpen(true);
            setStatus(newStatus);
        } else {
            setStatus(newStatus);
        }
    };

    // Submit status update
    const submitStatusUpdate = async (
        customStatus: "Pending" | "Present" | "Absent" | "Late" | "",
        customReason: string | null
    ) => {
        setUpdating(true);
        setSubmiting(true);
        try {
            // Send request
            const resp = await patchData(
                ApiEndpoints.ATTENDENCE_STATUS + `/${selectedAttendence._id}`,
                { status: customStatus, reason: customReason },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Updated reason
                const updatedReason = customReason
                    ? {
                        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                        description: customReason,
                    }
                    : { time: "", description: "" };

                // Update selected attendence
                setSelectedAttendence((prev: IAttendence | null) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        status: customStatus || prev.status,
                        reason: updatedReason,
                    };
                });

                // Update selected attendence in attendence list
                setAttendences((prev: IAttendence[]) => {
                    return prev.map((attendence: IAttendence) => {
                        if (attendence._id !== selectedAttendence._id) {
                            return attendence;
                        }
                        return {
                            ...attendence,
                            status: customStatus || attendence.status,
                            reason: updatedReason,
                        };
                    });
                });

                // Show toast only when status is there
                if (customStatus) {
                    toast({
                        title: `${selectedAttendence.user.name
                            }'s attendance marked as ${customStatus.toLowerCase()}.`,
                    });
                }

                setOpen(false);
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setStatus("");
            setUpdating(false);
            setSubmiting(false);
        }
    };

    // Handle attendence (check-in or check-out)
    const handleAttendence = async () => {
        try {
            // If already checked-in or checked-out
            if(selectedAttendence.checkIn && selectedAttendence.checkOut) return;
            
            setMarking(true);

            const activity = selectedAttendence.checkIn ? "checkOut" : "checkIn";

            // Send request
            const resp = await patchData(
                ApiEndpoints.CHECK_IN_OUT +
                `?attendanceId=${selectedAttendence?._id}&activity=${activity}`,
                {},
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                // Update selected attendence
                setSelectedAttendence((prev: IAttendence | null) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        ...(activity === "checkIn"
                            ? { checkIn: data.checkIn }
                            : { checkOut: data.checkOut }),
                    };
                });

                // Update selected attendence in attendence list
                setAttendences((prev: IAttendence[]) => {
                    return prev.map((attendence: IAttendence) => {
                        if (attendence._id !== selectedAttendence._id) {
                            return attendence;
                        }
                        return {
                            ...attendence,
                            ...(activity === "checkIn"
                                ? { checkIn: data.checkIn }
                                : { checkOut: data.checkOut }),
                        };
                    });
                });

                toast({
                    title: `${selectedAttendence.user.name}'s ${activity === "checkIn" ? "check-in" : "check-out"
                        } was recorded.`,
                });
            }
        } catch (err: unknown) {
            handleCustomError(err);
        } finally {
            setMarking(false);
        }
    };

    // Auto-update when status is not Absent
    useEffect(() => {
        if (status && !["Absent", "Late"].includes(status)) {
            submitStatusUpdate(status, null);
        }
    }, [status]);

    return (
        <div className="w-full relative p-5 flex flex-col gap-3 border bg-background dark:bg-sidebar-background rounded-2xl shadow-sm overflow-hidden">
            {/* Student info */}
            <div className="flex items-center justify-between mb-2">
                <UserNameCard
                    data={{
                        name: selectedAttendence.user.name,
                        email: selectedAttendence.user.email,
                        role: selectedAttendence.user.role,
                        profilePic: selectedAttendence.user.profilePic,
                    }}
                />
                <Badge
                    className={cn(
                        "self-start text-sm font-semibold rounded-full duration-0",
                        selectedAttendence.status === "Present"
                            ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                            : selectedAttendence.status === "Absent"
                                ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                : selectedAttendence.status === "Late"
                                    ? "text-blue-600 bg-blue-400/20 hover:bg-blue-400/30"
                                    : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                    )}
                >
                    {selectedAttendence.status}
                </Badge>
            </div>

            {/* Time line*/}
            <p className="text-start text-base w-full flex items-center gap-1">
                Timeline
            </p>

            {/* Time and duration info cards */}
            <div className="min-h-min w-full flex gap-3 overflow-scroll overflow-y-hidden no-scrollbar">
                {/* CheckIn */}
                <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-700/20 rounded-bl-full opacity-50"></div>
                    <InfoCard
                        Icon={LogOut}
                        label="Check-In Time"
                        text={
                            selectedAttendence.checkIn
                                ? convertTo12HourFormat(selectedAttendence.checkIn as string)
                                : "-"
                        }
                        iconClassName="text-green-600"
                        iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                        className="w-full border-none bg-transparent"
                    />
                </div>

                {/* CheckOut */}
                <div className="min-w-[250px] w-full  min-h-min bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200 dark:bg-pink-700/20 rounded-bl-full opacity-50"></div>
                    <InfoCard
                        Icon={LogOut}
                        label="Check-Out Time"
                        text={
                            selectedAttendence.checkOut
                                ? convertTo12HourFormat(selectedAttendence.checkOut as string)
                                : "-"
                        }
                        iconClassName="text-pink-600"
                        iconDivClassName="bg-pink-400/20 group-hover:bg-pink-400/30 rotate-180"
                        className="w-full border-none bg-transparent"
                    />
                </div>

                {/* Duration */}
                <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-700/20 rounded-bl-full opacity-50"></div>
                    <InfoCard
                        Icon={Hourglass}
                        label="Duration"
                        text={
                            selectedAttendence.checkIn && selectedAttendence.checkOut
                                ? (
                                    Number(selectedAttendence.checkOut.split(":")[0]) -
                                    Number(selectedAttendence.checkIn.split(":")[0])
                                ).toString() + " Hours"
                                : "-"
                        }
                        iconClassName="text-purple-600"
                        iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                        className="w-full border-none bg-transparent"
                    />
                </div>
            </div>

            {/* Break */}
            <p className="text-start text-base w-full flex items-center gap-1">
                Break snapshots
            </p>

            {/* Selfie updated with modal */}
            <SnapshotsModal
                children={
                    <div>
                        <InfoCard
                            Icon={Camera}
                            label="Attendence"
                            text="Break snapshots"
                            iconClassName="text-blue-600"
                            iconDivClassName="bg-blue-400/20 group-hover:bg-blue-400/30"
                            className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                        />
                    </div>
                }
                selectedAttedence={selectedAttendence}
            />

            {/* Reason */}
            {selectedAttendence?.reason?.description ? (
                <>
                    <p className="text-start text-base w-full flex items-center gap-1">
                        Reason
                    </p>

                    <ViewReasonModal
                        children={
                            <InfoCard
                                Icon={FileSpreadsheetIcon}
                                label="Absent / Late"
                                text="Reason"
                                iconClassName="text-orange-600"
                                iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                                className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                            />
                        }
                        selectedAttendence={selectedAttendence}
                        onSubmit={submitStatusUpdate}
                    />
                </>
            ) : (
                <>
                    <p className="text-start text-base w-full flex items-center gap-1">
                        Reason
                    </p>
                    <InfoCard
                        Icon={FileSpreadsheetIcon}
                        label={
                            selectedAttendence?.status &&
                                !["Present", "Pending"].includes(selectedAttendence.status)
                                ? "Didn't submit yet !"
                                : "Not needed"
                        }
                        text="Reason"
                        iconClassName="text-orange-600"
                        iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                        className={cn(
                            "w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark",
                            !selectedAttendence?.reason?.description &&
                            "opacity-80 cursor-not-allowed"
                        )}
                    />
                </>
            )}

            {/* Actions */}
            <div className="w-full flex items-center gap-2">
                <div className="space-y-2 relative text-start w-full flex flex-col">
                    {/* Label */}
                    <Label className="text-base text-foreground font-semibold">
                        Attendence
                    </Label>

                    <Button
                        className={cn(
                            "h-11 bg-muted dark:bg-sidebar hover:bg-muted dark:hover:bg-muted text-foreground",
                            selectedAttendence.checkOut && "cursor-not-allowed opacity-60 dark:hover:bg-sidebar"
                        )}
                        onClick={handleAttendence}
                        // disabled={selectedAttendence.checkOut ? true : false}
                    >
                        {marking ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </div>
                        ) : selectedAttendence.checkIn ? (
                            selectedAttendence.checkOut ? (
                                <span className="flex items-center gap-2">
                                    Checked In & Out
                                    <LucideCheckCircle2 className="text-green-600" />
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Check-Out
                                    <LogIn className="rotate-180 text-red-600" />
                                </span>
                            )
                        ) : (
                            <span className="flex items-center gap-2 text-blue-600">
                                Check-In
                                <LogIn />
                            </span>
                        )}
                    </Button>
                </div>

                <div className="space-y-2 relative text-start w-full flex flex-col">
                    {/* Label */}
                    <Label className="text-base text-foreground font-semibold">
                        Status
                    </Label>

                    {/* Status */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative w-full">
                            <Input
                                id="status"
                                type="text"
                                required
                                autoComplete="off"
                                value={selectedAttendence.status}
                                readOnly
                                onChange={() => { }}
                                className="text-foreground font-medium p-5 pl-3 cursor-pointer"
                            />
                            <ChevronDown className="absolute top-3 right-3 w-4 h-5 text-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["Pending", "Present", "Absent", "Late"].map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={(event) => {
                                        // Prevent default only for pending and present
                                        if (!["Absent", "Late"].includes(item)) {
                                            event.preventDefault();
                                        }

                                        // If already selected
                                        if (item === selectedAttendence.status) return;

                                        // Set status
                                        handleStatusChange(
                                            item as "Pending" | "Present" | "Absent" | "Late"
                                        );
                                    }}
                                    className="relative"
                                >
                                    {status === item && updating && (
                                        <Loader2 className="w-4 h-5 text-foreground animate-spin" />
                                    )}
                                    {status === item && updating ? "Processing" : item}

                                    {selectedAttendence.status === item && (
                                        <Check className="absolute right-2 w-4 h-4 text-foreground" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Submit reason modal */}
            {open && (
                <SubmitReasonModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                    }}
                    onSubmit={submitStatusUpdate}
                    status={status}
                    submiting={submiting}
                />
            )}
        </div>
    );
}

export default AttendenceDetails;
