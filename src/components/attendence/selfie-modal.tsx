import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

// Interface Props
interface Propstype{
    children: ReactNode;
}

// Selfie Component
function SelfieModal({children}:Propstype) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Break snapshots</DialogTitle>
                    <DialogDescription>
                        Snapshot updates on each break for attendence verification.
                    </DialogDescription>
                </DialogHeader>

                {/* Snapshots */}
                
            </DialogContent>
        </Dialog>
    );
}

export default SelfieModal;
