import React, { useState } from "react";
import InfoCard from "@/components/common/other-card/info-card";
import UserNameCard from "@/components/common/user/user-name-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IAttendence } from "@/types/IAttendence";
import { convertTo12HourFormat } from "@/utils/time-converter";
import {
    CalendarClock,
    Camera,
    Check,
    ChevronDown,
    FileSpreadsheetIcon,
    Hourglass,
    LogOut,
} from "lucide-react";
import SnapshotsModal from "./modal-snapshots";
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
import ViewReasonModal from "./modal-view-reason";
import { Button } from "@/components/ui/button";
import NotSelected from "@/components/common/fallback/not-selected";
import ApprovalConfirmModal from "./modal-approval-confirm";
import StatusConfirmModal from "./modal-status-confirm";
import { patchData } from "@/service/api-service";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import SubmitReasonModal from "./modal-submit-reason";

// Interface for Props
interface PropsType {
    setAttendences: React.Dispatch<React.SetStateAction<[] | IAttendence[]>>;
    selectedAttendence: IAttendence | null;
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
    const [open, setOpen] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    // Violation modal state
    const [openViolation, setOpenViolation] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle status change
    const handleStatusChange = async (status: string) => {
        if (status === "Late" || status === "Absent") {
            setOpen(false);
            setOpenViolation(true);
        } else {
            await handleSubmit(
                status as "Pending" | "Present" | "Absent" | "Late",
                ""
            );
        }
    };

    // Handle submit
    const handleSubmit = async (
        customStatus: "Pending" | "Present" | "Absent" | "Late" | "",
        customReason: string
    ) => {
        setSubmiting(true);
        try {
            // Send request
            const resp = await patchData(
                ApiEndpoints.ATTENDENCE_STATUS + `/${selectedAttendence?._id}`,
                { status: customStatus, violationReport: customReason },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Current time
                const currentTime = new Date();
                const hour = currentTime.getHours();
                const minute = currentTime.getMinutes();

                // Update selected attendence
                setSelectedAttendence((prev: IAttendence | null) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        status: customStatus || prev.status,
                        reason: { description: "", time: "" },
                        report: { description: customReason, time: `${hour}:${minute}` },
                    };
                });

                // Update selected attendence in attendence list
                setAttendences((prev: IAttendence[]) => {
                    return prev.map((attendence: IAttendence) => {
                        if (attendence._id !== selectedAttendence?._id) {
                            return attendence;
                        }
                        return {
                            ...attendence,
                            status: customStatus || attendence.status,
                            reason: { description: "", time: "" },
                            report: { description: customReason, time: `${hour}:${minute}` },
                        };
                    });
                });

                // Show toast only when status is there
                if (customStatus) {
                    toast({
                        title: `${selectedAttendence?.user.name
                            }'s attendance marked as ${customStatus.toLowerCase()}.`,
                    });
                }

                setOpen(false);
                setOpenViolation(false);
                setSelectedStatus("");
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setSubmiting(false);
        }
    };

    return (
        <>
            {selectedAttendence && (
                <div className="w-full h-fit relative p-5 flex flex-col gap-3 border bg-background dark:bg-sidebar-background rounded-2xl shadow-sm overflow-hidden">
                    {/* Student info */}
                    <div className="relative flex items-center justify-between mb-2">
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
                                "absolute right-0 top-0 text-sm font-semibold rounded-full duration-0",
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
                    <p className="text-start text-base text-foreground font-semibold w-full flex items-center gap-1">
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
                                        ? convertTo12HourFormat(
                                            selectedAttendence.checkIn as string
                                        )
                                        : "--:--"
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
                                        ? convertTo12HourFormat(
                                            selectedAttendence.checkOut as string
                                        )
                                        : "--:--"
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
                                        : "--"
                                }
                                iconClassName="text-purple-600"
                                iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                                className="w-full border-none bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Break */}
                    <p className="text-start text-base text-foreground font-semibold w-full flex items-center gap-1">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-w-0">
                        {["Reason", "Report"].map((type) => {
                            const isReason = type === "Reason";
                            const data = isReason
                                ? selectedAttendence?.reason?.description
                                : selectedAttendence?.report.description;

                            const label = isReason
                                ? selectedAttendence?.status &&
                                    !["Present", "Pending"].includes(selectedAttendence.status)
                                    ? "No reason submitted!"
                                    : "Not needed"
                                : selectedAttendence?.status &&
                                    !["Present", "Pending"].includes(selectedAttendence.status)
                                    ? "No report submitted!"
                                    : "Not needed";

                            const iconColor = isReason ? "text-orange-600" : "text-blue-600";
                            const iconBg = isReason
                                ? "bg-orange-400/20 group-hover:bg-orange-400/30"
                                : "bg-blue-400/20 group-hover:bg-blue-400/30";

                            return (
                                <div key={type} className="flex flex-col gap-1">
                                    <p className="text-start text-base text-foreground font-semibold w-full flex items-center gap-1">
                                        {type}
                                    </p>

                                    {data ? (
                                        <ViewReasonModal
                                            children={
                                                <InfoCard
                                                    Icon={FileSpreadsheetIcon}
                                                    label={"Absent/Late"}
                                                    text={type}
                                                    iconClassName={iconColor}
                                                    iconDivClassName={iconBg}
                                                    className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                                                />
                                            }
                                            selectedAttendence={selectedAttendence}
                                            isReason={isReason}
                                        />
                                    ) : (
                                        <InfoCard
                                            Icon={FileSpreadsheetIcon}
                                            label={label}
                                            text={type}
                                            iconClassName={iconColor}
                                            iconDivClassName={iconBg}
                                            className={cn(
                                                "w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark",
                                                !data && "cursor-not-allowed"
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="w-full flex items-center gap-3">
                        <div className="space-y-2 relative text-start w-full flex flex-col">
                            {/* Label */}
                            <Label className="text-base text-foreground font-semibold">
                                Attendence
                            </Label>

                            {!selectedAttendence.isApproved &&
                                !selectedAttendence.checkIn &&
                                new Date().toDateString() ===
                                new Date(selectedAttendence.date).toDateString() &&
                                new Date().getHours() >= 10 &&
                                new Date().getMinutes() != 0 ? (
                                <ApprovalConfirmModal
                                    children={
                                        <Button
                                            className={cn(
                                                "h-11 bg-muted hover:bg-muted dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark text-foreground"
                                            )}
                                        >
                                            Approval for check-in
                                        </Button>
                                    }
                                    setAttendences={setAttendences}
                                    selectedAttendence={selectedAttendence}
                                    setSelectedAttendence={setSelectedAttendence}
                                />
                            ) : (
                                <Button
                                    className={cn(
                                        "h-11 bg-muted hover:bg-muted dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark text-foreground",
                                        selectedAttendence.isApproved ? "cursor-not-allowed" : ""
                                    )}
                                >
                                    <span className="flex gap-2 items-center">
                                        {selectedAttendence.isApproved
                                            ? "Approved check-in"
                                            : "Approval not required"}
                                    </span>
                                </Button>
                            )}
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
                                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {["Pending", "Present", "Absent", "Late"].map(
                                        (item, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedStatus(item);
                                                    setOpen(true);
                                                }}
                                                className="relative p-0"
                                            >
                                                <p className="relative text-foreground font-medium text-sm w-full p-1.5">
                                                    {item}
                                                    {selectedAttendence.status === item && (
                                                        <Check className="absolute z-10 right-2 top-2 w-4 h-4 " />
                                                    )}
                                                </p>
                                            </DropdownMenuItem>
                                        )
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            )}

            {/* Status confirm modal */}
            <StatusConfirmModal
                open={open}
                setOpen={setOpen}
                status={selectedStatus}
                selectedAttendence={selectedAttendence}
                submiting={submiting}
                handleStatusChange={handleStatusChange}
            />

            {/* Violation modal */}
            <SubmitReasonModal
                open={openViolation}
                setOpen={setOpenViolation}
                status={selectedStatus}
                selectedAttendence={selectedAttendence}
                submiting={submiting}
                handleSubmit={handleSubmit}
            />

            {/* No attendence selected */}
            {!selectedAttendence && (
                <NotSelected
                    Icon={CalendarClock}
                    message="Select an attendance to view it's details"
                    text="No attendance selected"
                    className="h-[540px]"
                />
            )}
        </>
    );
}

export default AttendenceDetails;
