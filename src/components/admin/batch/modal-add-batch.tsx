import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, UsersRound, Loader2 } from "lucide-react";

// Add batch modal
function AddBatchModal() {
    return (
        <Dialog>
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
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Add new batch</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill the information below to add new batch.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-3">
                    {/* Input for name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm text-foreground font-medium"
                        >
                            Batch Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder="Enter batch's name"
                                required
                                autoComplete="off"
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Name error message */}
                        {/* <ValidationError message={errors.name?.message as string} /> */}
                    </div>
                    {/* Submit button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={false}
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

export default AddBatchModal;
