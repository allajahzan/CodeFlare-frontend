import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { stateType } from "@/redux/store";
import { patchData } from "@/service/api-service";
import { IAttendence } from "@/types/IAttendence";
import { handleCustomError } from "@/utils/error";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { useSelector } from "react-redux";

// Interface for Props
interface PropsType {
    children: ReactNode;
    setAttendences: React.Dispatch<React.SetStateAction<IAttendence[]>>;
    selectedAttendence: IAttendence;
    setSelectedAttendence: React.Dispatch<
        React.SetStateAction<IAttendence | null>
    >;
}

// Approval confirm modal Component
function ApprovalConfirmModal({
    children,
    setAttendences,
    selectedAttendence,
    setSelectedAttendence,
}: PropsType) {
    // Modal state
    const [open, setOpen] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle approval for check-in
    const handleSubmit = async () => {
        try {
            setSubmiting(true);

            // Send request
            const resp = await patchData(
                ApiEndpoints.ATTENDENCE_APPROVAL + `/${selectedAttendence?._id}`,
                {},
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update selected attendence
                setSelectedAttendence((prev: IAttendence | null) => {
                    if (!prev) return null;

                    return {
                        ...prev,
                        isApproved: true,
                    };
                });

                // Update attendence list
                setAttendences((prev: IAttendence[]) => {
                    return prev.map((attendence: IAttendence) => {
                        if (attendence._id === selectedAttendence?._id) {
                            return {
                                ...attendence,
                                isApproved: true,
                            };
                        } else {
                            return attendence;
                        }
                    });
                });

                toast({
                    title: `Approved check-in for ${selectedAttendence.user.name}.`,
                });

                setSubmiting(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                aria-describedby={undefined}
                className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>
                            Do you wanna give approval to {selectedAttendence.user.name}?
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Give approval for this student to check-in on this day.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => setOpen(false)}
                        className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submiting}
                        className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
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

export default ApprovalConfirmModal;
