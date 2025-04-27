import { ReactNode, useContext, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { FileSpreadsheetIcon, Send } from "lucide-react";
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

// Interface for Props
interface Propstype {
    children: ReactNode;
    warnings: any;
    user: IUser;
}

interface Reply {
    id: string;
    content: string;
    createdAt: Date;
    user: IUser;
}

interface Warning {
    id: string;
    content: string;
    createdAt: Date;
    user: IUser;
    replies: Reply[];
}

// Dummy data for warnings and replies
const dummyWarnings: Warning[] = [
    {
        id: "1",
        content:
            "Employee has been consistently late for the morning meetings. This is affecting team coordination and project timelines.",
        createdAt: new Date(2023, 3, 15, 9, 30),
        user: {
            _id: "admin1",
            name: "HR Manager",
            email: "hr@company.com",
            profilePic: "/placeholder.svg?height=40&width=40",
            role: "coordinator",
        },
        replies: [
            {
                id: "r1",
                content:
                    "I apologize for the delays. I've been having transportation issues which I'm working to resolve. Will ensure to be on time going forward.",
                createdAt: new Date(2023, 3, 15, 11, 45),
                user: {
                    _id: "emp1",
                    name: "John Doe",
                    email: "john@company.com",
                    profilePic: "/placeholder.svg?height=40&width=40",
                    role: "student",
                },
            },
        ],
    },
];

// Format date to display
const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
};

// Warning Card Component
const WarningCard = ({ warning }: { warning: Warning }) => {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

    return (
        <Card className="border-l-4 border-l-red-600 bg-background hover:bg-muted/50 dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark">
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
                        {formatDate(warning.createdAt)}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pb-0 pl-20">
                <p className="text-sm font-medium">{warning.content}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0 pb-0">
                {warning.replies.length > 0 && (
                    <>
                        <Separator className="my-4" />
                        <div className="w-full pl-6">
                            {warning.replies.map((reply) => (
                                <div key={reply.id} className="mb-4">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarImage
                                                src={reply.user.profilePic || "/placeholder.svg"}
                                                alt={reply.user.name}
                                            />
                                            <AvatarFallback>
                                                {reply.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div className="font-medium text-sm">
                                                {reply.user.name}
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {formatDate(reply.createdAt)}
                                            </p>
                                            <p className="text-sm mt-2">{reply.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

// Warnings lists modal Component
function WarningsListsModal({
    children,
    warnings = dummyWarnings,
    user,
}: Propstype) {
    const [newWarning, setNewWarning] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically add the new warning to your state or send to an API
        console.log("New warning:", newWarning);
        setNewWarning("");
        // For a real implementation, you would add the new warning to the list
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background max-h-max max-w-5xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-start text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Warnings and replies-{user.name}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        These are the list of warnings and their replies in this month
                    </DialogDescription>
                </DialogHeader>

                {dummyWarnings.length > 0 && (
                    <div className="pb-1 flex flex-col gap-5 overflow-auto no-scrollbar">
                        {dummyWarnings.map((warning: Warning) => (
                            <WarningCard key={warning.id} warning={warning} />
                        ))}
                    </div>
                )}

                {/* <Separator className="my-2" /> */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="font-medium text-sm text-foreground">
                        Send a new warning
                    </p>
                    <Textarea
                        placeholder="Type warning message here..."
                        className="min-h-[100px] text-[14.5px] text-foreground resize-none"
                        value={newWarning}
                        onChange={(e) => setNewWarning(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Post Warning
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default WarningsListsModal;
