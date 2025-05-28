import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ValidationError from "@/components/ui/validation-error";
import ApiEndpoints from "@/constants/api-endpoints";
import { IUserContext, UserContext } from "@/context/user-context";
import { stateType } from "@/redux/store";
import { postData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { IStudent } from "@codeflare/common";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IDefaulters } from "./monthly-defaulters";

// Interface for Props
interface Propstype {
    children: ReactNode;
    student: IStudent;
    setDefaulters: React.Dispatch<React.SetStateAction<[] | IDefaulters[]>>;
}

// Send warning modal Component
function SendWarningModal({ children, student, setDefaulters }: Propstype) {
    // Modal states
    const [open, setOpen] = useState<boolean>(false);

    // Form states
    const [newWarning, setNewWarning] = useState<string>("");
    const [submiting, setSubmiting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newWarning.trim().length === 0) return setError(true);

        setError(false);
        setSubmiting(true);

        try {
            // Send request
            const resp = await postData(
                ApiEndpoints.WARNING,
                {
                    warning: {
                        studentId: student._id,
                        coordinatorId: user?._id,
                        message: newWarning,
                        date: new Date(),
                    },
                },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                // Update defaulters
                setDefaulters((prev: IDefaulters[]) => {
                    return prev.map((defaulter) => {
                        if (defaulter.userId === student._id) {
                            return {
                                ...defaulter,
                                warnings: [data, ...defaulter.warnings],
                            };
                        } else {
                            return defaulter;
                        }
                    });
                });

                setNewWarning("");
                setSubmiting(false);

                // Close modal
                setOpen(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Reset on close and open
    useEffect(() => {
        setNewWarning("");
        setSubmiting(false);
        setError(false);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined} className="flex flex-col gap-10 dark:bg-sidebar-background">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Send warning to {student.name}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Here you can send a warning to this student.
                    </DialogDescription>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 w-full">
                    <div className="space-y-2">
                        <p className="font-medium text-sm text-foreground">
                            Warning message
                        </p>
                        <Textarea
                            required
                            placeholder="Type here..."
                            className="min-h-[100px] text-[14.5px] text-foreground resize-none"
                            value={newWarning}
                            onChange={(e) => setNewWarning(e.target.value)}
                        />
                        {error && <ValidationError message="Warning message is required" />}
                    </div>

                    {/* Custom file input */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={submiting}
                            className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                <>
                                    {/* <Send className="h-4 w-4" /> */}
                                    Send Warning
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default SendWarningModal;
