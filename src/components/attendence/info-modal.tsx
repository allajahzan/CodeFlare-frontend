import { Calendar1, CalendarClockIcon, ShieldQuestion } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../ui/dialog";
import { IEvent } from "./calender";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Interface for Props
interface PropsType {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEvent: IEvent;
}

// Infot modal Component
function InfoModal({ isModalOpen, setIsModalOpen, selectedEvent }: PropsType) {
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent autoFocus={false}>
                <DialogTitle className="text-foreground flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                        <CalendarClockIcon className="w-4 h-4" />
                    </div>
                    <span>Attendence Info</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                    Details of the attendence for this day.
                </DialogDescription>

                {/* Details */}
                <div className="space-y-2 flex flex-col">
                    {/* Date */}
                    <div className="space-y-2">
                        <Label
                            className="text-sm text-foreground font-medium"
                        >
                            Date
                        </Label>

                        <div className="relative">
                            <Input
                                placeholder="Date"
                                readOnly
                                disabled
                                value={new Date(selectedEvent?.date).toDateString()}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Calendar1 className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label
                            className="text-sm text-foreground font-medium"
                        >
                            Status
                        </Label>

                        <div className="relative">
                            <Input
                                placeholder="Date"
                                disabled
                                readOnly
                                value={selectedEvent?.status[0].toUpperCase() + selectedEvent?.status.slice(1)}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <ShieldQuestion className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                     {/* Start */}
                     <div className="space-y-2">
                        <Label
                            className="text-sm text-foreground font-medium"
                        >
                            Start
                        </Label>

                        <div className="relative">
                            <Input
                                placeholder="Date"
                                disabled
                                readOnly
                                value={new Date(selectedEvent?.start).toLocaleTimeString()}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <ShieldQuestion className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                      {/* End */}
                      <div className="space-y-2">
                        <Label
                            className="text-sm text-foreground font-medium"
                        >
                            End
                        </Label>

                        <div className="relative">
                            <Input
                                placeholder="Date"
                                disabled
                                readOnly
                                value={new Date(selectedEvent?.start).toLocaleTimeString()}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <ShieldQuestion className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/*  */}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default InfoModal;
