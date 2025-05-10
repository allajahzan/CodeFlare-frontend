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
import { formSchemaBatch, FormTypeBatch } from "@/validations/admin/batch";
import { formSchemaWeek, FormTypeWeek } from "@/validations/admin/week";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { IBatch, IDomain, IWeek } from "@codeflare/common";
import { useLocation } from "react-router-dom";

// Interface for Props
interface PropsType {
    itemToEdit: IBatch | IWeek | IDomain;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setItems: React.Dispatch<React.SetStateAction<IBatch[] | IWeek[] | IDomain[]>>;
    setSelectedItem: React.Dispatch<React.SetStateAction<IBatch | IWeek | IDomain | null>>;
}

// Edit curriculum modal
function EditCurriculumModal({
    itemToEdit,
    open,
    setOpen,
    setItems,
    setSelectedItem,
}: PropsType) {
    // Modal state
    const [submiting, setSubmiting] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Pathname
    const pathname = useLocation().pathname;
    const path = pathname.split("/")[pathname.split("/").length - 1];

    // Form validator
    const isBatches = path === "batches";

    type FormType = typeof path extends "batches" ? FormTypeBatch : FormTypeWeek;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(isBatches ? formSchemaBatch : formSchemaWeek),
    });

    // Onsubmit
    const OnSubmit: SubmitHandler<FormType> = async (formData) => {
        setSubmiting(true);

        try {
            // Send request
            const resp = await updateData(
                (isBatches ? ApiEndpoints.BATCH : ApiEndpoints.WEEK) +
                `/${itemToEdit._id}`,
                formData,
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Set batches
                setItems((prevBatches: IBatch[]) => {
                    return prevBatches.map((batch) => {
                        if (batch._id === itemToEdit._id) {
                            return {
                                ...batch,
                                name: formData.name,
                            };
                        }
                        return batch;
                    });
                });

                // Update the selected batch if its selected
                setSelectedItem((batch: IBatch | null) => {
                    if (batch && batch._id === itemToEdit._id) {
                        return {
                            ...batch,
                            name: formData.name,
                        };
                    }
                    return batch;
                });

                toast({
                    title: `${isBatches
                            ? "Batch name udpated successfully."
                            : "Week name udpated successfully."
                        }`,
                });

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
            name: itemToEdit?.name || "",
        });
    }, [itemToEdit, reset]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Update {isBatches ? "batch" : "week"}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Update the information below to edit the{" "}
                        {isBatches ? "batch" : "week"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(OnSubmit)} className="space-y-3">
                    {/* Input for name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm text-foreground font-medium"
                        >
                            {isBatches ? "Batch" : "Week"} Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder={`Enter ${isBatches ? "batch" : "week"}'s name`}
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

export default EditCurriculumModal;
