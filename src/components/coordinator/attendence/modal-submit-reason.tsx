import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Add this if you don’t already
import { cn } from "@/lib/utils";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ValidationError from "@/components/ui/validation-error";

// Interface for Props
interface PropsType {
    onClose: () => void;
    open: boolean;
    onSubmit: (
        customStatus: "Pending" | "Present" | "Absent" | "Late" | "",
        customReason: string | null
    ) => Promise<void>;
    status: "Pending" | "Present" | "Absent" | "Late" | "";
    submiting: boolean;
}

// Reason Modal Component
function SubmitReasonModal({
    onClose,
    open,
    onSubmit,
    status,
    submiting,
}: PropsType) {
    // Form state
    const [reason, setReason] = useState("");
    const [error, setError] = useState<boolean>(false);

    // Handle submit
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError(true);
            return;
        }

        onSubmit(status, reason); // Send request
    };

    // Set and reset pointer events of body
    useEffect(() => {
        setTimeout(() => {
            document.body.style.pointerEvents = "none";
        }, 0);

        return () => {
            setTimeout(() => {
                document.body.style.pointerEvents = "auto";
            }, 0);
        };
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent
                aria-describedby={undefined}
                className={cn(
                    "flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)]"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Submit reason for absent/late</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This is the reason why the student is absent/late.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Reason Field */}
                    <div className="space-y-2 relative text-start">
                        <Label className="text-sm text-foreground font-medium">
                            Reason
                        </Label>
                        <div className="relative">
                            <Textarea
                                placeholder="Enter the reason"
                                rows={3}
                                value={reason}
                                required
                                onChange={(event) => setReason(event.target.value)}
                                className="p-2.5 pl-9 text-foreground font-medium border bg-background resize-none"
                            />
                            <FileSpreadsheetIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                        {error && <ValidationError message="Reason is required" />}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submiting}
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        >
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
