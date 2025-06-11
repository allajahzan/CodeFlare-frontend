import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IAttendence } from "@/types/IAttendence";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { useLayoutEffect } from "react";

// Interface for Props
interface PropsType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    status: string;
    selectedAttendence: IAttendence | null;
    submiting: boolean;
    handleStatusChange: (status: string) => void;
}

// Status confirm modal Component
function StatusConfirmModal({
    open,
    setOpen,
    status,
    selectedAttendence,
    submiting,
    handleStatusChange
}: PropsType) {

    // Control modal
    useLayoutEffect(() => {
        if (open && selectedAttendence?.status === status) {
            setOpen(false);
        } else {
            document.body.style.pointerEvents = "auto";
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onClick={(e) => e.preventDefault()}
                className="flex flex-col gap-10 dark:bg-sidebar-background"
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Do you wanna change status to {status.toLowerCase()}?</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Change this student's attendence status of this day.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2">
                    <Button onClick={() => setOpen(false)} className="w-full h-11">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleStatusChange(status)}
                        disabled={submiting}
                        className="w-full h-11"
                    >
                        {submiting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            "Yes"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default StatusConfirmModal;
