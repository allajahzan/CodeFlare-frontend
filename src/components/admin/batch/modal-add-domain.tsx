import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Plus, GraduationCap } from "lucide-react";
import { useState } from "react";

// Add domain modal Component
function AddDomainModal() {
    // Modal state
    const [open, setOpen] = useState<boolean>(false);
 
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div
                    className="p-2 rounded-full bg-foreground dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700 
                  text-white shadow-md cursor-pointer"
                >
                    <Plus className={cn("h-4 w-4 transition-transform duration-0")} />
                </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <GraduationCap className="w-4 h-4"/>
                        </div>
                        <span>Add new domain</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Here you can add new domain to codeflare.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default AddDomainModal;
