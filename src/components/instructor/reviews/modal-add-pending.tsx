import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ApiEndpoints from "@/constants/api-endpoints";
import { cn } from "@/lib/utils";
import { stateType } from "@/redux/store";
import { patchData } from "@/service/api-service";
import { IReview } from "@/types/IReview";
import { handleCustomError } from "@/utils/error";
import { Loader2, Pencil, UsersRound } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Interface for Props
interface Propstype {
    className?: string;
    setReview: React.Dispatch<React.SetStateAction<IReview[]>>;
    setSelectedReview: React.Dispatch<React.SetStateAction<IReview | null>>;
    selectedReview: IReview;
}

// Add pending modal
function AddPendingModal({
    className,
    setReview,
    setSelectedReview,
    selectedReview,
}: Propstype) {
    // Modal states
    const [open, setOpen] = useState<boolean>(false);

    const [texts, setTexts] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Add pendings
    const handleAddPendings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitting(true);

        try {
            const lines = texts
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0); // Remove empty lines

            // Send request
            const resp = await patchData(
                ApiEndpoints.REVIEW + `/${selectedReview._id}`,
                { pendings: lines },
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update selected review
                setSelectedReview((prevReview: IReview | null) => {
                    if (!prevReview) return null;

                    return {
                        ...prevReview,
                        pendings: lines,
                    };
                });

                // Update reviews list
                setReview((prevReviews: IReview[]) => {
                    return prevReviews.map((review: IReview) => {
                        if (review._id === selectedReview._id) {
                            return {
                                ...review,
                                pendings: lines,
                            };
                        } else {
                            return review;
                        }
                    });
                });

                setSubmitting(false);
                setOpen(false);
                setTexts("")
            }
        } catch (err: unknown) {
            setSubmitting(false);
            handleCustomError(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div
                    className={cn(
                        "p-2 cursor-pointer bg-muted dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-full",
                        className
                    )}
                >
                    <Pencil className="h-4 w-4 text-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent
                aria-describedby={undefined}
                className="flex flex-col gap-10 bg-background dark:bg-sidebar-background"
            >
                {/* Header */}
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Add Pendings</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill the form below to add pending for this reviews.
                    </DialogDescription>
                </DialogHeader>

                {/* Form */}
                <form
                    onSubmit={handleAddPendings}
                    className="h-full flex flex-col gap-3"
                >
                    <Textarea
                        placeholder="Event loop..."
                        defaultValue={selectedReview.pendings?.join("\n") || ""}
                        required
                        className="resize-none flex-1 text-foreground"
                        rows={8}
                        onChange={(e) => setTexts(e.target.value)}
                    />

                    {/* Submit button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
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

export default AddPendingModal;
