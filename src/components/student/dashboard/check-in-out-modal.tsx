import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ApiEndpoints from "@/constants/api-endpoints";
import { UserContext, IUserContext } from "@/context/user-context";
import { toast } from "@/hooks/use-toast";
import { stateType } from "@/redux/store";
import { patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, LogOut } from "lucide-react";
import { ReactNode, useContext, useState } from "react";
import { useSelector } from "react-redux";

// Interface for Props
interface Propstype {
    children: ReactNode;
    activity: string;
}

// Checked In Out Modal Component
function CheckedInOutModal({ children, activity }: Propstype) {
    // Modal state
    const [open, setOpen] = useState<boolean>(false);

    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User Context
    const { user } = useContext(UserContext) as IUserContext;

    // CheckInOut
    const handleCheckIn = async (activity: string) => {
        try {
            setSubmiting(true);

            const time = new Date();
            const hours = time.getHours();
            const minutes = time.getMinutes();

            // Send request
            const resp = await patchData(
                ApiEndpoints.CHECK_IN_OUT + `?userId=${user?._id}&activity=${activity}`,
                { time: `${hours}:${minutes}` },
                role
            );

            // Success Response
            if (resp && resp.status === 200) {
                setSubmiting(false);

                toast({
                    title: `You have successfully ${activity === "checkIn" ? "checked In." : "checked Out."
                        }`,
                });

                setOpen(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <LogOut
                                className={`w-4 h-4 ${activity === "checkOut" && "rotate-180"}`}
                            />
                        </div>
                        <span>
                            Confirm {activity === "checkIn" ? "check-In" : "check-Out"}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This operation can't be undone, So think before you confirm.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full flex items-center justify-end gap-1">
                    <Button
                        onClick={() => setOpen(false)}
                        className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={submiting}
                        onClick={() => handleCheckIn(activity)}
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
            </DialogContent>
        </Dialog>
    );
}

export default CheckedInOutModal;
