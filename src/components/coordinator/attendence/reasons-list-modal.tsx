import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { IAttendence } from "@/types/attendence";
import { FileSpreadsheetIcon } from "lucide-react";
import { ReactNode } from "react";

// Interface for Props
interface Propstype {
    status: string;
    records: IAttendence[];
    children: ReactNode;
}

// View all reasons modal Component
function ReasonsListModal({ status, records, children }: Propstype) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <FileSpreadsheetIcon className="w-4 h-4" />
                        </div>
                        <span>Reasons for {status.toLowerCase()}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        This is the reason why the student is {status.toLowerCase()} for
                        these days.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 overflow-auto no-scrollbar">
                    {records.map((record, index) => (
                        <div
                            key={index}
                            className="relative p-5 px-3 rounded-lg bg-background border dark:bg-sidebar dark:border-transparent hover:bg-muted/50 dark:hover:bg-sidebar-backgroundDark"
                        >
                            {/* Date */}
                            <p className="absolute left-3 top-3 text-muted-foreground font-medium text-sm">
                                {new Date(record.date || "2023-01-01").toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </p>

                            {/* Reason */}
                            <p className="text-foreground font-medium text-sm mt-3">
                                {record.reason?.description
                                    ? record.reason.description
                                    : "Nill"}
                            </p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReasonsListModal;
