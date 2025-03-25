import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode;
}

// Attendence Info Modal
function AttendenceInfoModal({ children }: PropsType) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <Info className="w-4 h-4" />
                        </div>
                        <span>Guidlines about attendence</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Read all the guidlines about attendence and how it monitered.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default AttendenceInfoModal;
