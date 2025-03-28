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
import ValidationError from "@/components/ui/validation-error";
import ApiEndpoints from "@/constants/api-endpoints";
import { cn } from "@/lib/utils";
import { stateType } from "@/redux/store";
import { postData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { formSchema, FormType } from "@/validations/admin/batch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UsersRound, Loader2, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { IBatch } from "@/types/batch";

// Interface for Props
interface Propstype {
    setNewBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
}

// Add batch modal
function AddBatchModal({ setNewBatch }: Propstype) {
    // Modal state
    const [open, setOpen] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({ resolver: zodResolver(formSchema) });

    // Onsubmit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await postData(ApiEndpoints.BATCH, formData, role);

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data.data;

                // Set new batch
                setNewBatch(() => {
                    return {
                        _id: data._id,
                        name: data.name,
                    };
                });

                toast({ title: "Batch added successfully." });

                // Clear
                setSubmiting(false);
                setOpen(false);
                reset();
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Clear form
    useEffect(() => {
        !open ? reset() : null;
    }, [open]);

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
                            <ScanFace className="w-4 h-4" />
                        </div>
                        <span>Add new batch</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Ensure secure check-ins and check-outs with facial recognition.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(OnSubmit)} className="space-y-3">
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
                                {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Name error message */}
                        <ValidationError message={errors.name?.message as string} />
                    </div>
                    {/* Submit button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={submiting}
                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
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
