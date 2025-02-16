import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Loader2, UserRound } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormType } from "@/validations/profile/social-links";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { postData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationError from "../ui/validation-error";
import { IProfile } from "@/types/profile";

// Interface for Props
interface PropsType {
    profile: IProfile;
}

// Social links Components
function SocialLinks({ profile }: PropsType) {
    // Form related states
    const [submiting, setSubmiting] = useState(false);

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

        const data: FormType = {
            portfolio: formData.portfolio,
            github: formData.github,
            linkedin: formData.linkedin,
            instagram: formData.instagram,
        };

        try {
            const resp = await postData(ApiEndpoints.PROFILE, data, role);

            if (resp && resp.status === 200) {
                setSubmiting(false);

                toast({ title: "Successfully added social links." });
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Reset social links
    useEffect(() => {
        reset({
            portfolio: profile.portfolio,
            github: profile.github,
            linkedin: profile.linkedin,
            instagram: profile.instagram,
        });
    }, []);

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onSubmit={handleSubmit(OnSubmit)}
            className="space-y-5"
        >
            {/* Portfolio */}
            <motion.div
                className="space-y-2 relative"
                key={1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Label
                    htmlFor="portfolio"
                    className="text-sm text-foreground font-medium"
                >
                    Portfolio
                </Label>
                <div className="relative">
                    <Input
                        id="portfolio"
                        type="text"
                        placeholder="Portfolio URL"
                        autoComplete="off"
                        {...register("portfolio")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <UserRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Portfolio error */}
                <ValidationError message={errors.portfolio?.message as string} />
            </motion.div>

            {/* Github */}
            <motion.div
                className="space-y-2 relative"
                key={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Label htmlFor="github" className="text-sm text-foreground font-medium">
                    GitHub
                </Label>
                <div className="relative">
                    <Input
                        id="github"
                        type="text"
                        placeholder="GitHub URL"
                        autoComplete="off"
                        {...register("github")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Github className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Github error */}
                <ValidationError message={errors.github?.message as string} />
            </motion.div>

            {/* LinkedIn */}
            <motion.div
                className="space-y-2 relative"
                key={3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Label
                    htmlFor="linkedIn"
                    className="text-sm text-foreground font-medium"
                >
                    LinkedIn
                </Label>
                <div className="relative">
                    <Input
                        id="linkedIn"
                        type="text"
                        placeholder="LinkedIn URL"
                        autoComplete="off"
                        {...register("linkedin")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Linkedin className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Linkedin error */}
                <ValidationError message={errors.linkedin?.message as string} />
            </motion.div>

            {/* Instagram */}
            <motion.div
                className="space-y-2 relative"
                key={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Label
                    htmlFor="instagram"
                    className="text-sm text-foreground font-medium"
                >
                    Instagram
                </Label>
                <div className="relative">
                    <Input
                        id="instagram"
                        type="text"
                        placeholder="Instagram URL"
                        autoComplete="off"
                        {...register("instagram")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Instagram className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Instagram error */}
                <ValidationError message={errors.instagram?.message as string} />
            </motion.div>

            {/* button */}
            <motion.div
                key={5}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-2 w-full"
            >
                <Button
                    variant="default"
                    type="submit"
                    disabled={submiting}
                    className="w-full h-11 sh:cursor-not-allowed"
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
            </motion.div>
        </motion.form>
    );
}

export default SocialLinks;
