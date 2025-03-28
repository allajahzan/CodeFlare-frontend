import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Dot, Info } from "lucide-react";
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
            <DialogContent className="flex flex-col gap-5 dark:bg-sidebar-background max-h-screen">
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

                {/* Guildlines */}
                <div className="overflow-auto no-scrollbar">
                    <Accordion type="single" collapsible>
                        {/* Work Hours */}
                        <AccordionItem value="item-1" className="py-1">
                            <AccordionTrigger className="text-foreground font-semibold text-base py-3 hover:underline hover:underline-offset-1">
                                Work Hours
                            </AccordionTrigger>
                            <AccordionContent className="font-medium text-foreground">
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    The official workday starts at 9:00 AM.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    You are required to be present for a minimum of 8 hours daily.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    Attendance is monitored throughout the day, with the final
                                    attendance being marked at 10:00 PM.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* CheckIn Rules */}
                        <AccordionItem value="item-2" className="py-1">
                            <AccordionTrigger className="text-foreground font-semibold text-base py-3 hover:underline hover:underline-offset-1">
                                Check-in Rules
                            </AccordionTrigger>
                            <AccordionContent className="font-medium text-foreground">
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    Check-in must be done before 9:00 AM.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    If you check in between 9:00 AM and 10:00 AM, you are
                                    considered late and must provide a valid reason.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    If you check in after 10:00 AM, you are very late and must
                                    contact your coordinator.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Break Schedule */}
                        <AccordionItem value="item-3" className="py-1">
                            <AccordionTrigger className="text-foreground font-semibold text-base py-3 hover:underline hover:underline-offset-1">
                                Break Schedule
                            </AccordionTrigger>
                            <AccordionContent className="font-medium text-foreground">
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    Tea Break – 11:00 AM.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    Lunch Break – 1:00 PM.
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    Evening Break – 4:00 PM.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Verification & Monitoring */}
                        <AccordionItem value="item-4" className="py-1">
                            <AccordionTrigger className="text-foreground font-semibold text-base py-3 hover:underline hover:underline-offset-1">
                                Verification & Monitoring
                            </AccordionTrigger>
                            <AccordionContent className="font-medium text-foreground">
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    At designated break times and throughout the day, you will
                                    receive notifications prompting you to submit a verification
                                    snapshot (selfie).
                                </p>
                                <p className="py-2 flex items-center">
                                    <Dot className="flex-shrink-0 self-start" />
                                    The coordinator will review these snapshots to confirm your
                                    presence.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AttendenceInfoModal;
