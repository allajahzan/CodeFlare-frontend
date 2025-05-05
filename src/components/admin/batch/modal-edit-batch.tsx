import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ValidationError from "@/components/ui/validation-error";
import ApiEndpoints from "@/constants/api-endpoints";
import { stateType } from "@/redux/store";
import { updateData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import { formSchema, FormType } from "@/validations/admin/batch";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { IBatch } from "@/types/IBatch";

// Interface for Props
interface PropsType {
    batchToEdit: IBatch;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBatches: React.Dispatch<React.SetStateAction<IBatch[]>>;
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
}

// Add batch modal
function EditBatchModal({
    batchToEdit,
    open,
    setOpen,
    setBatches,
    setSelectedBatch,
}: PropsType) {
    // Modal state
    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Form validaotr
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
            const resp = await updateData(
                ApiEndpoints.BATCH + `/${batchToEdit._id}`,
                formData,
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Set batches
                setBatches((prevBatches: IBatch[]) => {
                    return prevBatches.map((batch) => {
                        if (batch._id === batchToEdit._id) {
                            return {
                                ...batch,
                                name: formData.name,
                            };
                        }
                        return batch;
                    });
                });

                // Update the selected batch if its selected
                setSelectedBatch((batch: IBatch | null) => {
                    if (batch && batch._id === batchToEdit._id) {
                        return {
                            ...batch,
                            name: formData.name,
                        };
                    }
                    return batch;
                });

                toast({ title: "Batch updated successfully." });

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

    useEffect(() => {
        reset({
            name: batchToEdit?.name || "",
        });
    }, [batchToEdit, reset]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Update batch</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Update the information below to edit the batch.
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
