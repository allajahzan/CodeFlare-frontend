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
import { UsersRound, Loader2 } from "lucide-react";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode
}

// Add batch modal
function EditBatchModal({children}:PropsType) {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Edit batch</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Update the information below to edit batch.
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
                                "Update"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditBatchModal;
