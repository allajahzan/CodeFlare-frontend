import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Copy, Info, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useCallback, useContext, useEffect, useState } from "react";
import { stateType } from "@/redux/store";
import { IUserContext, UserContext } from "@/context/user-context";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { postData } from "@/service/api-service";
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

// Interface for Props
interface PropsType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Meet ID Modal
function ModalMeetId({ open, setOpen }: PropsType) {
    const [roomId, setRoomId] = useState<string>("");
    const [fetching, setFetching] = useState<boolean | null>(true);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // copy to clipboard
    const handleCopy = useCallback(
        async (roomId: string) => {
            try {
                await navigator.clipboard.writeText(roomId);
                toast({ title: "Link copied to clipboard" });
            } catch (error) {
                console.log("Failed to copy to clipboard:", error);
                toast({ title: "Failed to copy to clipboard" });
            }
        },
        [toast]
    );

    useEffect(() => {
        const createMeet = async () => {
            try {
                setFetching(true);

                // Send request
                const resp = await postData(
                    ApiEndpoints.MEET,
                    {
                        hostId: user?._id,
                    },
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update roomId
                    setTimeout(() => {
                        setRoomId(`${window.location.origin}/instructor/meet/` + data.roomId);
                        setFetching(false);
                    }, 500);
                }
            } catch (err: unknown) {
                handleCustomError(err);
                setFetching(false);
            }
        };

        open && createMeet();

        return () => {
            document.body.style.pointerEvents = "auto";
            setRoomId("");
            setFetching(null);
        };
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                style={{ height: "199.6px" }}
                aria-describedby={undefined}
                className="flex flex-col gap-10 bg-background dark:bg-sidebar-background"
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <Info className="w-4 h-4" />
                        </div>
                        <span>Here is your joining info</span>
                    </DialogTitle>
                    {!fetching && (
                        <DialogDescription className="text-muted-foreground font-medium">
                            Send this to people you want to meet with. Be sure to save it so
                            you can use it later too.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {fetching ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Input for name */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="name"
                                    placeholder="CodeFlare meet ID"
                                    required
                                    autoComplete="off"
                                    readOnly
                                    defaultValue={roomId}
                                    className="text-foreground font-medium p-5 pr-9 border-none bg-muted dark:bg-sidebar dark:hover:bg-sidebar cursor-auto"
                                />
                                <div
                                    onClick={() => handleCopy(roomId)}
                                    className="absolute right-1 top-1 p-2 cursor-pointer"
                                >
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ModalMeetId;
