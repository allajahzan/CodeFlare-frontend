import {
    Calendar1,
    CalendarClockIcon,
    Clock,
    FileSpreadsheet,
    ShieldQuestion,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { IEvent } from "./attendence";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { Textarea } from "@/components/ui/textarea";

// Interface for Props
interface PropsType {
    children: ReactNode;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAttendence: IEvent;
}

// Details modal Component
function DetailsModal({
    isModalOpen,
    setIsModalOpen,
    selectedAttendence,
}: PropsType) {
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <CalendarClockIcon className="w-4 h-4" />
                        </div>
                        <span>Attendence details</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Attendence details of this day.
                    </DialogDescription>
                </DialogHeader>

                {/* Details */}
                <div className="space-y-2 flex flex-col">
                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">Date</Label>
                        <div className="relative">
                            <Input
                                placeholder="Date"
                                readOnly
                                disabled
                                value={
                                    selectedAttendence?.date
                                        ? new Date(selectedAttendence.date).toDateString()
                                        : ""
                                }
                                className="text-foreground font-medium p-5 pl-9 disabled:cursor-default"
                            />
                            <Calendar1 className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Check-in Time */}
                    <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">
                            Check-in
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Check-in"
                                disabled
                                readOnly
                                value={
                                    selectedAttendence?.checkIn
                                        ? convertTo12HourFormat(selectedAttendence.checkIn)
                                        : "--:--"
                                }
                                className="text-foreground font-medium p-5 pl-9 disabled:cursor-default"
                            />
                            <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Check-out - Time */}
                    <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">
                            Check-out
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Check-out"
                                disabled
                                readOnly
                                value={
                                    selectedAttendence?.checkOut
                                        ? convertTo12HourFormat(selectedAttendence.checkOut)
                                        : "--:--"
                                }
                                className="text-foreground font-medium p-5 pl-9 disabled:cursor-default"
                            />
                            <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">
                            Status
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Status"
                                disabled
                                readOnly
                                value={
                                    selectedAttendence?.status
                                        ? selectedAttendence.status[0].toUpperCase() +
                                        selectedAttendence.status.slice(1)
                                        : ""
                                }
                                className="text-foreground font-medium p-5 pl-9 disabled:cursor-default"
                            />
                            <ShieldQuestion className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Reason */}
                    {(selectedAttendence?.status === "absent" ||
                        selectedAttendence?.status === "late") && (
                            <div className="space-y-2">
                                <Label className="text-sm text-foreground font-medium">
                                    Reason
                                </Label>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Reason"
                                        readOnly
                                        disabled
                                        rows={3}
                                        value={
                                            selectedAttendence.reason ? selectedAttendence.reason : "..."
                                        }
                                        className="p-2.5 pl-9 text-foreground font-medium border bg-background resize-none disabled:cursor-default"
                                    />
                                    <FileSpreadsheet className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                </div>
                            </div>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DetailsModal;
