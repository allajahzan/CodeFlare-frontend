import { Fragment, ReactNode, useContext } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { FileSpreadsheetIcon, TriangleAlert } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { IStudent } from "@codeflare/common";
import { IUserContext, UserContext } from "@/context/user-context";
import profile from "@/assets/images/no-profile.svg";
import { cn } from "@/lib/utils";
import { IWarning } from "@/types/IWarning";
import NotFoundYet from "@/components/common/fallback/not-found-text"

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
    student: IStudent;
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
    student: IStudent;
    warnings: IWarning[];
}

// Warnings lists modal Component
function WarningsListsModal({ children, student, warnings }: Propstype) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[88vh] max-w-5xl overflow-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-start text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Warnings & replies - {student.name} ({warnings ? warnings.length : 0})</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Warnings and replies of this student in this month.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5 overflow-hidden w-full">
                    {/* If not warnings */}
                    {!warnings && (
                        <NotFoundYet
                            MainIcon={TriangleAlert}
                            text="No warnings & replies"
                            IconClassName="w-5 h-5"
                        />
                    )}

                    {/* If warnings are there */}
                    {warnings && warnings.length > 0 && (
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
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default WarningsListsModal;
