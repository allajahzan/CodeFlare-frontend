import { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { FileSpreadsheetIcon, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { IUser } from "@codeflare/common";
import { IUserContext, UserContext } from "@/context/user-context";
import profile from "@/assets/images/no-profile.svg";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { fetchData, postData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { handleCustomError } from "@/utils/error";
import { cn } from "@/lib/utils";
import ValidationError from "@/components/ui/validation-error";
import { IWarning } from "@/types/warning";
import { Skeleton } from "@/components/ui/skeleton";

// Format date to display
const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
};

// Warning Card Component
const WarningCard = ({
    warning,
    student,
}: {
    warning: IWarning;
    student: IUser;
}) => {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

    return (
        <Card className="border-l-4 border-l-red-800 shadow-sm bg-background hover:bg-muted/60 dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="bg-background w-10 h-10 border-2 border-background dark:border-border shadow-md">
                    <AvatarImage src={user?.profilePic} className="object-cover" />
                    <AvatarFallback className="bg-transparent">
                        <img src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="font-semibold">{"You"}</div>
                    <p className="text-sm text-muted-foreground font-medium">
                        {formatDate(new Date(warning.date))}
                    </p>
                </div>
            </CardHeader>
            <CardContent className={cn("pl-20", warning.reply?.length > 0 && "pb-0")}>
                <p className="text-sm font-medium">{warning.message}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0 pb-0">
                {warning && warning.reply?.length > 0 && (
                    <Fragment key={warning._id}>
                        <Separator className="my-4" />
                        <div className="w-full pl-6">
                            {warning.reply.map((reply) => (
                                <div key={reply.date} className="">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarImage
                                                src={student.profilePic}
                                                alt={student.name}
                                            />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div className="font-medium text-sm">{student.name}</div>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {formatDate(new Date(reply.date))}
                                            </p>
                                            <p className="text-sm mt-2">{reply.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                )}
            </CardFooter>
        </Card>
    );
};

// Interface for Props
interface Propstype {
    children: ReactNode;
    student: IUser;
    month: string;
    year: number;
}

// Warnings lists modal Component
function WarningsListsModal({ children, student, month, year }: Propstype) {
    // Modal states
    const [open, setOpen] = useState<boolean>(false);

    // Warnings states
    const [warnings, setWarnings] = useState<IWarning[] | []>([]);
    const [fetching, setFetching] = useState<boolean>(true);

    // Form states
    const [newWarning, setNewWarning] = useState<string>("");
    const [submiting, setSubmiting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

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

                // Update warnings list
                setWarnings((prev: IWarning[]) => {
                    return [
                        {
                            _id: data._id,
                            message: data.message,
                            date: data.date,
                            reply: [],
                        },
                        ...prev,
                    ];
                });

                setNewWarning("");
                setSubmiting(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Fetch warnings
    useEffect(() => {
        const fetchWarnings = async () => {
            setFetching(true);

            try {
                // Send response
                const resp = await fetchData(
                    ApiEndpoints.WARNING +
                    `?userId=${student._id}&month=${month}&year=${year}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    setTimeout(() => {
                        setWarnings(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        open && fetchWarnings();
    }, [open]);

    // Reset on close and open
    useEffect(() => {
        setNewWarning("");
        setSubmiting(false);
        setError(false);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[95vh] max-w-6xl overflow-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-start text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Warnings and replies</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        List of warnings and replies of this student in this month
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5 overflow-hidden w-full">
                    {fetching && <WarningCardSkeleton />}

                    {!fetching && warnings && warnings.length > 0 && (
                        <div className="pb-1 flex flex-col gap-3 overflow-auto no-scrollbar">
                            {warnings.map((warning: IWarning) => (
                                <WarningCard
                                    key={warning._id}
                                    warning={warning}
                                    student={student}
                                />
                            ))}
                        </div>
                    )}

                    {/* <Separator className="my-10" /> */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3 w-full bg-background"
                    >
                        <div className="space-y-2">
                            <p className="font-medium text-sm text-foreground">
                                Send a new warning
                            </p>
                            <Textarea
                                required
                                placeholder="Type warning message here..."
                                className="min-h-[100px] text-[14.5px] text-foreground resize-none"
                                value={newWarning}
                                onChange={(e) => setNewWarning(e.target.value)}
                            />
                            {error && (
                                <ValidationError message="Warning message is required" />
                            )}
                        </div>

                        {/* Custom file input */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={submiting}
                                className="h-11 w-[140px] transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                {submiting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Warning
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Skeloton - Warning card Component
function WarningCardSkeleton() {
    return (
        <Card className="border-l-4 border-l-red-800 shadow-sm bg-background dark:bg-sidebar">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" /> {/* Name skeleton */}
                    <Skeleton className="h-3 w-16" /> {/* Date skeleton */}
                </div>
            </CardHeader>

            <CardContent className="pl-20 space-y-2">
                <Skeleton className="h-4 w-[80%]" /> {/* Warning message line */}
                <Skeleton className="h-4 w-[60%]" />
            </CardContent>

            <CardFooter className="flex flex-col items-start pt-0 pb-5 w-full">
                <div className="w-full pl-6 space-y-4">
                    {[...Array(1)].map((_, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-4 w-28" /> {/* Student name */}
                                <Skeleton className="h-3 w-20" /> {/* Reply date */}
                                <Skeleton className="h-4 w-[70%]" /> {/* Reply message */}
                            </div>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}

export default WarningsListsModal;
