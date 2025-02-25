import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck2, Loader2, UserRound, UsersRound } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns/format";

// Interface for Props
interface PropsTyps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    events: {
        title: string;
        start: Date;
        end: Date;
    }[];
    setEvents: React.Dispatch<
        React.SetStateAction<
            {
                title: string;
                start: Date;
                end: Date;
            }[]
        >
    >;
    selectedSlot: any;
}

// Add event modal component
function AddEventModal({
    isOpen,
    setIsOpen,
    events,
    setEvents,
    selectedSlot,
}: PropsTyps) {
    // Handle set event
    const handleScheduleReview = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;

        setEvents([
            ...events,
            {
                title,
                start: selectedSlot.start,
                end: selectedSlot.end,
            },
        ]);

        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <CalendarCheck2 className="w-4 h-4" />
                        </div>
                        <span>Schedule a review</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill the information below to add schedule review.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-3">
                    {/* Input for name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="week"
                            className="text-sm text-foreground font-medium"
                        >
                            Week
                        </Label>
                        <div className="relative">
                            <Input
                                id="week"
                                placeholder="Enter batch's name"
                                required
                                autoComplete="off"
                                // {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <CalendarCheck2 className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Name error message */}
                        {/* <ValidationError message={errors.name?.message as string} /> */}
                    </div>

                    {/* Input for batches */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="role"
                            className="text-sm text-foreground font-medium"
                        >
                            Batches
                        </Label>
                        <div className="relative">
                            <Select
                                required
                            // onValueChange={(value) => {
                            //     setValue("batch", value);
                            // }}
                            >
                                <SelectTrigger
                                    id="batches"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder="Select a batch"
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {["batch 1", "batch 2"].map((batch, index) => (
                                        <SelectItem key={index} value={batch}>
                                            {batch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Batch error message */}
                        {/* <ValidationError message={errors.batch?.message as string} /> */}
                    </div>

{/* Students */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="role"
                            className="text-sm text-foreground font-medium"
                        >
                            Students
                        </Label>
                        <div className="relative">
                            <Select
                                required
                            // onValueChange={(value) => {
                            //     setValue("batch", value);
                            // }}
                            >
                                <SelectTrigger
                                    id="batches"
                                    className="text-foreground font-medium p-5 pl-9 relative"
                                >
                                    <SelectValue
                                        placeholder="Select a student"
                                        className="relative transition-opacity duration-200"
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {["Ahsan allaj pk", "Ahsan allaj"].map((batch, index) => (
                                        <SelectItem key={index} value={batch}>
                                            {batch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <UserRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Batch error message */}
                        {/* <ValidationError message={errors.batch?.message as string} /> */}
                    </div>

                    {/* Date and time */}
                    <div className="space-y-2">
                        <Label>Time</Label>
                        <div className="">
                            <p className="font-medium text-muted-foreground">{selectedSlot &&
                                format(selectedSlot.start, "MMMM d, yyyy h:mm a")}</p>
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            // disabled={submiting}
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {false ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Add"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddEventModal;
