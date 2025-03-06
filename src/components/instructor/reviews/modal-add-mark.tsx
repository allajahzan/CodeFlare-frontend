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
import { UsersRound, Loader2, Pencil, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { Review } from "./reviews";

// Interface for Props
interface Propstype {
    className: string;
    selectedReview: Review;
}

// Add batch modal
function AddMarkModal({ className, selectedReview }: Propstype) {
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
            const resp = await postData(
                ApiEndpoints.REVIEW_SCORE + `/${selectedReview._id}`,
                formData,
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                const data = resp.data.data;

                toast({ title: "Score updated successfully." });

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
                <div className={cn("p-2 cursor-pointer", className)}>
                    <Pencil className="h-4 w-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <UsersRound className="w-4 h-4" />
                        </div>
                        <span>Update Score</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill the information below to update score.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(OnSubmit)} className="space-y-3">
                    {/* Input for theory score */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="theory"
                            className="text-sm text-foreground font-medium"
                        >
                            Theory's Score
                        </Label>
                        <div className="relative">
                            <Input
                                id="theory"
                                placeholder="Enter theory's score"
                                type = "number"
                                required
                                autoComplete="off"
                                {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Trophy className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                        {/* Name error message */}
                        <ValidationError message={errors.name?.message as string} />
                    </div>

                    {/* Input for practical score */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="practical"
                            className="text-sm text-foreground font-medium"
                        >
                            Practical's Score
                        </Label>
                        ``
                        <div className="relative">
                            <Input
                                id="practical"
                                placeholder="Enter practical's score"
                                type = "number"
                                required
                                autoComplete="off"
                                {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Trophy className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
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

export default AddMarkModal;
