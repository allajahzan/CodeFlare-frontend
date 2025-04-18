import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import InfoCard from "@/components/common/other-cards/info-card";
import { CameraIcon, Eye, MapPin, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IAttendence } from "@/types/attendence";

// Interface Props
interface Propstype {
    children: ReactNode;
    selectedAttedence: IAttendence;
}

// Selfie Component
function SnapshotsModal({ children, selectedAttedence }: Propstype) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)]">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <CameraIcon className="w-4 h-4" />
                        </div>
                        <span>Break snapshots</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Snapshot updates on each break
                    </DialogDescription>
                </DialogHeader>

                {/* Snapshots */}
                <Accordion
                    type="multiple"
                    className="flex flex-col gap-3 overflow-auto no-scrollbar"
                >
                    {/* Tea break */}
                    <AccordionItem
                        value="item-1"
                        className="border-b-0 relative flex flex-col gap-3"
                    >
                        <AccordionTrigger>
                            <InfoCard
                                Icon={Eye}
                                label="11:00 AM"
                                text="Tea break"
                                iconClassName="text-blue-600"
                                iconDivClassName="bg-blue-400/20 group-hover:bg-blue-400/30"
                                className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="relative">
                                <div className="w-full h-[280px] flex items-center justify-center dark:bg-sidebar rounded-xl p-2 border dark:border-transparent shadow-sm overflow-hidden">
                                    {/* Tea break */}
                                    {selectedAttedence.selfies?.[0]?.name === "Tea" ? (
                                        <>
                                            <Badge className="p-1 px-2 absolute max-w-max bottom-5 left-5 right-5 text-xs text-black font-semibold bg-white hover:bg-muted dark:hover:bg-zinc-200 shadow-md rounded-full overflow-hidden cursor-pointer">
                                                <p className="self-start p-[3px]">
                                                    <MapPin className="w-4 h-4 text-black flex-shrink-0" />
                                                </p>
                                                &nbsp;
                                                <p className="text-sm font-medium">
                                                    {selectedAttedence.selfies[0].location
                                                        .split(",")
                                                        .filter((_, index) => index > 0 && index < 5)
                                                        .join(",")}
                                                </p>
                                            </Badge>
                                            <img
                                                src={selectedAttedence.selfies[0].photo}
                                                className="h-full w-full object-cover rounded-lg"
                                                alt=""
                                            />
                                            {/* <div className="absolute top-0 right-0 p-5">
                                                <Button className="bg-white hover:bg-muted shadow-md text-black">
                                                    Verify
                                                </Button>
                                            </div> */}
                                        </>
                                    ) : (
                                        <p className="text-foreground font-medium text-sm">
                                            No snapshot
                                        </p>
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Lunch break */}
                    <AccordionItem
                        value="item-2"
                        className="border-b-0 relative flex flex-col gap-3"
                    >
                        <AccordionTrigger>
                            <InfoCard
                                Icon={Plus}
                                label="1:00 PM"
                                text="Lunch break"
                                iconClassName="text-orange-600"
                                iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                                className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="relative">
                                <div className="w-full h-[280px] flex items-center justify-center dark:bg-sidebar rounded-xl p-2 border dark:border-transparent shadow-sm overflow-hidden">
                                    {/* Lunch break */}
                                    {selectedAttedence.selfies?.[1]?.name === "Lunch" ? (
                                        <>
                                            <Badge className="p-1 px-2 max-w-max absolute bottom-5 left-5 right-5 text-xs text-black font-semibold bg-white hover:bg-muted dark:hover:bg-zinc-200 shadow-md rounded-full overflow-hidden cursor-pointer">
                                                <p className="self-start p-[3px]">
                                                    <MapPin className="w-4 h-4 text-black flex-shrink-0" />
                                                </p>
                                                &nbsp;
                                                <p className="text-sm font-medium">
                                                    {selectedAttedence.selfies[1].location
                                                        .split(",")
                                                        .filter((_, index) => index > 0 && index < 6)
                                                        .join(",")}
                                                </p>
                                            </Badge>
                                            <img
                                                src={selectedAttedence.selfies[1].photo}
                                                className="h-full w-full object-cover rounded-lg"
                                                alt=""
                                            />
                                            {/* <div className="absolute top-0 right-0 p-5">
                                                <Button className="bg-white hover:bg-muted shadow-md text-black">
                                                    Verify
                                                </Button>
                                            </div> */}
                                        </>
                                    ) : (
                                        <p className="text-foreground font-medium text-sm">
                                            No snapshot
                                        </p>
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Evening */}
                    <AccordionItem
                        value="item-3"
                        className="border-b-0 relative flex flex-col gap-3"
                    >
                        <AccordionTrigger>
                            <InfoCard
                                Icon={Minus}
                                label="4:00 PM"
                                text="Evening break"
                                iconClassName="text-yellow-600"
                                iconDivClassName="bg-yellow-400/20 group-hover:bg-yellow-400/30"
                                className="w-full shadow-sm border dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="relative">
                                <div className="w-full h-[280px] flex items-center justify-center dark:bg-sidebar rounded-xl p-2 border dark:border-transparent shadow-sm overflow-hidden">
                                    {/* Evening break */}
                                    {selectedAttedence.selfies?.[2]?.name === "Evening" ? (
                                        <>
                                            <Badge className="p-1 px-2 max-w-max absolute bottom-5 left-5 right-5 text-xs text-black font-semibold bg-white hover:bg-muted dark:hover:bg-zinc-200 shadow-md rounded-full overflow-hidden cursor-pointer">
                                                <p className="self-start p-[3px]">
                                                    <MapPin className="w-4 h-4 text-black flex-shrink-0" />
                                                </p>
                                                &nbsp;
                                                <p className="text-sm font-medium">
                                                    {selectedAttedence.selfies[2].location
                                                        .split(",")
                                                        .filter((_, index) => index > 0 && index < 6)
                                                        .join(",")}
                                                </p>
                                            </Badge>
                                            <img
                                                src={selectedAttedence.selfies[1].photo}
                                                className="h-full w-full object-cover rounded-lg"
                                                alt=""
                                            />
                                            {/* <div className="absolute top-0 right-0 p-5">
                                                <Button className="bg-white hover:bg-muted shadow-md text-black">
                                                    Verify
                                                </Button>
                                            </div> */}
                                        </>
                                    ) : (
                                        <p className="text-foreground font-medium text-sm">
                                            No snapshot
                                        </p>
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </DialogContent>
        </Dialog>
    );
}

export default SnapshotsModal;
