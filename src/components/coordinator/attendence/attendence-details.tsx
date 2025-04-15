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
    Clock,
    FileSpreadsheetIcon,
    Hourglass,
    Loader2,
    LogOut,
} from "lucide-react";
import SnapshotsModal from "./snapshots-modal";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    const [status, setStatus] = useState<"Pending" | "Present" | "Absent" | "">(
        ""
    );

    const [updating, setUpdating] = useState<boolean>(false);

    // Update status
    useEffect(() => {
        const updateStatus = async () => {
            setUpdating(true);

            try {
                // Send request
                const resp = await patchData(
                    ApiEndpoints.ATTENDENCE_STATUS + `/${selectedAttendence._id}`,
                    { status },
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    // Upadate selected attendence
                    setSelectedAttendence((prev: IAttendence | null) => {
                        if (!prev) return null;
                        return { ...prev, status: status as any };
                    });

                    // Update selected attendence in attendence list
                    setAttendences((prev: IAttendence[]) => {
                        return prev.map((attendence: IAttendence) => {
                            if (attendence._id !== selectedAttendence._id) {
                                return attendence;
                            }
                            return { ...attendence, status: status as any };
                        });
                    });

                    toast({
                        title: `${selectedAttendence.user.name
                            }'s attendence marked as ${status.toLowerCase()}.`,
                    });

                    setUpdating(false);
                    setStatus("");
                }
            } catch (err: unknown) {
                setUpdating(false);
                setStatus("");

                handleCustomError(err);
            }
        };

        status && updateStatus();
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

                <DropdownMenu>
                    <DropdownMenuTrigger className="self-start flex items-center gap-2">
                        <Badge
                            className={cn(
                                "text-sm font-semibold rounded-full duration-0",
                                selectedAttendence.status === "Present"
                                    ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                    : selectedAttendence.status === "Absent"
                                        ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                        : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                            )}
                        >
                            {selectedAttendence.status || "Pending"}
                        </Badge>
                        <ChevronDown className="w-4 h-5 text-black" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["Pending", "Absent", "Present"].map((item, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (item === selectedAttendence.status) return;
                                    setStatus(item as typeof status);
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
            <p className="text-start text-base w-full flex items-center gap-1">
                Reason
            </p>

            {/* Reason */}

            <Accordion type="single" collapsible>
                <AccordionItem
                    value="item-1"
                    className="border-b-0 relative flex flex-col"
                >
                    <AccordionTrigger>
                        <InfoCard
                            Icon={FileSpreadsheetIcon}
                            label="Absent / Late"
                            text="Reason"
                            iconClassName="text-orange-600"
                            iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                            className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                        />
                    </AccordionTrigger>
                    <AccordionContent className="mt-3">
                        {selectedAttendence.reason.time && (
                            <div className="relative flex flex-col gap-3 p-5 border dark:border-transparent bg-background dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark rounded-lg">
                                {/* Time */}
                                <div className="space-y-2 relative text-start">
                                    {/* Label */}
                                    <Label className="text-sm text-foreground font-medium">
                                        Time
                                    </Label>

                                    {/* Time */}
                                    <div className="relative">
                                        <Input
                                            id="time"
                                            type="text"
                                            placeholder="Time"
                                            readOnly
                                            required
                                            defaultValue={convertTo12HourFormat(
                                                selectedAttendence.reason.time
                                            )}
                                            className="text-foreground font-medium p-5 pl-9 border"
                                        />
                                        <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="space-y-2 relative text-start">
                                    {/* Label */}
                                    <Label className="text-sm text-foreground font-medium">
                                        Reason
                                    </Label>

                                    {/* Time */}
                                    <div className="relative">
                                        <Textarea
                                            placeholder="Reason"
                                            readOnly
                                            rows={3}
                                            defaultValue={selectedAttendence.reason.description}
                                            className="text-foreground font-medium border bg-background resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* If no reason */}
                        {!selectedAttendence.reason?.time && (
                            <p className="text-start text-sm font-medium">
                                {selectedAttendence.status === "Absent" ? (
                                    "Reason not submitted"
                                ) : (
                                    <>Not needed</>
                                )}
                            </p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default AttendenceDetails;
