import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IAttendence } from "@/types/IAttendence";
import { convertTo12HourFormat } from "@/utils/time-converter";
import { Clock, FileSpreadsheetIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode;
    selectedAttendence: IAttendence;
    // onSubmit: (
    //     customStatus: "Pending" | "Present" | "Absent" | "Late" | "",
    //     customReason: string | null
    // ) => Promise<void>;
}

// Reason modal Component
function ViewReasonModal({
    children,
    selectedAttendence,
}: // onSubmit,
    PropsType) {
    const [reason, setReason] = useState<string>("");
    const [updating, setUpdating] = useState<boolean>(false);

    // Reset reason
    useEffect(() => {
        setReason(selectedAttendence.reason.description);
    }, [selectedAttendence]);

    // // Handle submit
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     try {
    //         if (selectedAttendence.reason.description === reason) return;

    //         setUpdating(true);

    //         onSubmit("", reason); // Send request
    //     } catch (err: unknown) {
    //         handleCustomError(err);
    //     } finally {
    //         setUpdating(false);
    //     }
    // };

    const reasonChanged = reason !== selectedAttendence.reason.description;

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent
                aria-describedby={undefined}
                className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)]"
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Reason for absent/late</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This is the reason why student is absent/late.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Time Display */}
                    <div className="space-y-2 text-start">
                        <Label className="text-sm text-foreground font-medium">Time</Label>
                        <div className="relative">
                            <Input
                                type="text"
                                readOnly
                                disabled
                                value={convertTo12HourFormat(selectedAttendence.reason.time)}
                                className="text-foreground font-medium p-5 pl-9 border disabled:cursor-default"
                            />
                            <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Reason Input */}
                    <div className="space-y-2 relative text-start">
                        <Label className="text-sm text-foreground font-medium">
                            Reason
                        </Label>
                        <div className="relative">
                            <Textarea
                                placeholder="Enter the reason"
                                rows={3}
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                className="p-2.5 pl-9 text-foreground font-medium border bg-background resize-none"
                            />
                            <FileSpreadsheetIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Update Button */}
                    {/* {reasonChanged && (
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="flex justify-end"
                        >
                            <Button
                                type="submit"
                                disabled={updating}
                                className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                {updating ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Update"
                                )}
                            </Button>
                        </motion.div>
                    )} */}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewReasonModal;
