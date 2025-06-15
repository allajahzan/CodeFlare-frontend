import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ValidationError from "@/components/ui/validation-error";
import { IAttendence } from "@/types/IAttendence";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { useLayoutEffect, useState } from "react";

// Interface for Props
interface PropsType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    status: string;
    selectedAttendence: IAttendence | null;
    submiting: boolean;
    handleSubmit: (
        status: "Pending" | "Present" | "Absent" | "Late" | "",
        reason: string
    ) => Promise<void>;
}

// Status confirm modal Component
function SubmitReasonModal({
    open,
    setOpen,
    status,
    selectedAttendence,
    submiting,
    handleSubmit,
}: PropsType) {
    const [violationNote, setViolationNote] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    // Handle violation form submit
    const handleViolationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate violation note
        if (!violationNote.trim()) {
            setError(true);
            return;
        }

        setError(false);

        await handleSubmit(
            status as "Pending" | "Present" | "Absent" | "Late" | "",
            violationNote
        );

        // Reset violation form
        setViolationNote("");
        setOpen(false);
    };

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
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Submit report for absent/late</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This is the reason why student is marked as absent/late.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-2 relative z-10"
                    onSubmit={handleViolationSubmit}
                >
                    <div className="space-y-2 relative text-start">
                        <Label
                            htmlFor="report"
                            className="text-sm text-foreground font-medium"
                        >
                            Report
                        </Label>
                        <div className="relative">
                            <Textarea
                                id="report"
                                placeholder="Enter the report"
                                rows={3}
                                value={violationNote}
                                required
                                onChange={(e) => {
                                    setViolationNote(e.target.value);
                                    // Clear error when user starts typing
                                    if (error) {
                                        setError(false);
                                    }
                                }}
                                className="p-2.5 pl-9 text-foreground font-medium border bg-background resize-none"
                            />
                            <FileSpreadsheetIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {error && <ValidationError message="Reason is required" />}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setViolationNote("");
                                setError(false);
                            }}
                            className="w-full h-11"
                            disabled={submiting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submiting} className="w-full h-11">
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default SubmitReasonModal;
