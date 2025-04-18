import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiEndpoints from "@/constants/api-endpoints";
import { UserContext, IUserContext } from "@/context/user-context";
import { toast } from "@/hooks/use-toast";
import { checkedInAction, stateType } from "@/redux/store";
import { patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { FileSpreadsheetIcon, Loader2, LogOut } from "lucide-react";
import { FormEvent, ReactNode, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Interface for Props
interface Propstype {
    children: ReactNode;
}

// Checked In Out Modal Component
function CheckedInOutModal({ children }: Propstype) {
    // Modal state
    const [open, setOpen] = useState<boolean>(false);

    // Reson
    const [reason, setReason] = useState<string>("");
    const [showReason, setShowReason] = useState<boolean>(false);

    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    const dispatch = useDispatch();

    // User Context
    const { user } = useContext(UserContext) as IUserContext;

    // CheckInOut
    const handleCheckInOut = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const activity = isCheckedIn ? "checkOut" : "checkIn";

            setSubmiting(true);

            const time = new Date();
            const hours = time.getHours();
            const minutes = time.getMinutes();

            // Send request
            const resp = await patchData(
                ApiEndpoints.CHECK_IN_OUT + `?userId=${user?._id}&activity=${activity}`,
                { time: `${hours}:${minutes}`, reason },
                role
            );

            // Success Response
            if (resp && resp.status === 200) {
                setSubmiting(false);

                // Update isCheckedIn
                if (isCheckedIn) {
                    dispatch(checkedInAction(false));
                } else {
                    dispatch(checkedInAction(true));
                }

                toast({
                    title: `You have successfully ${activity === "checkIn" ? "checked In." : "checked Out."
                        }`,
                });

                setOpen(false);
            }
        } catch (err: unknown) {
            if ((err as { status: number; msg: string }).status === 500) {
                setShowReason(true);
            }

            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Clear the states
    useEffect(() => {
        if (open) {
            setShowReason(false);
            setReason("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 bg-background dark:bg-sidebar-background">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <LogOut className={`w-4 h-4 ${!isCheckedIn && "rotate-180"}`} />
                        </div>
                        <span>Confirm {isCheckedIn ? "check-out" : "check-in"}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This operation can't be undone, So think before you confirm.
                    </DialogDescription>
                </DialogHeader>

                {/* Reason */}
                <form onSubmit={handleCheckInOut} className="flex flex-col space-y-5">
                    {showReason && (
                        <motion.div
                            className="space-y-2 relative"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Label
                                htmlFor="reason"
                                className="text-sm text-foreground font-medium"
                            >
                                Reason
                            </Label>
                            <div className="relative">
                                <Input
                                    id="reason"
                                    type="text"
                                    placeholder="Reason"
                                    autoComplete="off"
                                    required
                                    value={reason}
                                    onChange={(event) => setReason(event.target.value)}
                                    className="p-5 pl-9 text-foreground font-medium"
                                />
                                <FileSpreadsheetIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                            </div>
                        </motion.div>
                    )}

                    <div className="w-full flex items-center justify-end gap-2">
                        <Button
                            onClick={() => setOpen(false)}
                            type="button"
                            className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={submiting}
                            className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CheckedInOutModal;
