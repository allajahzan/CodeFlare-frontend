import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Book,
    Briefcase,
    Building,
    Info,
    Loader2,
    Mail,
    Phone,
    School,
    UserRound,
    UsersRound,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useContext, useEffect, useState } from "react";
import ApiEndpoints from "@/constants/api-endpoints";
import { postData } from "@/service/api-service";
import { stateType } from "@/redux/store";
import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, Formtype } from "@/validations/profile/account";
import { IUserContext, UserContext } from "@/context/user-context";
import ValidationError from "../ui/validation-error";
import { IProfile } from "@/types/profile";
import { toast } from "@/hooks/use-toast";
import { IBatch } from "../admin/batch/batches";

// Interface for Props
interface PropsType {
    profile: IProfile;
}

// Account Component
function Account({ profile }: PropsType) {
    // Form related states
    const [submiting, setSubmiting] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Form validator
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Formtype>({ resolver: zodResolver(formSchema) });

    // OnSubmit
    const OnSubmit: SubmitHandler<Formtype> = async (formData) => {
        setSubmiting(true);

        const resp = await postData(ApiEndpoints.PROFILE, formData, role);

        if (resp && resp.status === 200) {
            setSubmiting(false);

            // Update the local storage
            const user = localStorage.getItem("user") || {};
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...JSON.parse(user as string),
                    name: formData.name,
                })
            );

            toast({ title: "Successfully updated profile." });
        }
    };

    // Fetch social links
    useEffect(() => {
        reset({
            name: user?.name,
            phoneNumber: profile.phoneNumber,
            bio: profile.bio,
            about: profile.about,
            softSkills: profile.softSkills,
            techSkills: profile.techSkills,
            work: profile.work,
            education: profile.education,
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
            {/* Full name */}
            <motion.div
                className="space-y-2 relative"
                key={1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Label htmlFor="name" className="text-sm text-foreground font-medium">
                    Full Name
                </Label>
                <div className="relative">
                    <Input
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        autoComplete="off"
                        required
                        {...register("name")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <UserRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Name error */}
                <ValidationError message={errors.name?.message as string} />
            </motion.div>

            {/* Email */}
            <motion.div
                className="space-y-2 relative"
                key={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Label htmlFor="email" className="text-sm text-foreground font-medium">
                    Email
                </Label>
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="off"
                        disabled
                        defaultValue={user?.email}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Phone number */}
            <motion.div
                className="space-y-2 relative"
                key={3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Label
                    htmlFor="phoneNo"
                    className="text-sm text-foreground font-medium"
                >
                    Phone Number
                </Label>
                <div className="relative">
                    <Input
                        id="phoneNo"
                        type="text"
                        placeholder="Phone Number"
                        autoComplete="off"
                        {...register("phoneNumber")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* PhoneNumber error */}
                <ValidationError message={errors.phoneNumber?.message as string} />
            </motion.div>

            {/* Role */}
            <motion.div
                className="space-y-2 relative"
                key={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Label htmlFor="role" className="text-sm text-foreground font-medium">
                    Role
                </Label>
                <div className="relative">
                    <Input
                        id="role"
                        type="text"
                        placeholder="Role"
                        autoComplete="off"
                        disabled
                        defaultValue={user?.role}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Briefcase className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Batch / Batches - if not admin */}
            {role !== "admin" && (
                <motion.div
                    className="space-y-2 relative"
                    key={5}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Label
                        htmlFor="batch"
                        className="text-sm text-foreground font-medium"
                    >
                        {user?.batch ? "Batch" : "Batches"}
                    </Label>
                    <div className="relative">
                        <Input
                            id="batch"
                            type="text"
                            placeholder={user?.batch ? "Batch" : "Batches"}
                            autoComplete="off"
                            defaultValue={
                                user?.batch?.name || (user?.batches as IBatch[])?.join(", ")
                            }
                            disabled
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>
            )}

            {/* Bio */}
            <motion.div
                className="space-y-2 relative"
                key={6}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Label htmlFor="bio" className="text-sm text-foreground font-medium">
                    Bio
                </Label>
                <div className="relative">
                    <Input
                        id="bio"
                        type="text"
                        placeholder="Bio"
                        autoComplete="off"
                        {...register("bio")}
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <Info className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>

                {/* Bio error */}
                <ValidationError message={errors.bio?.message as string} />
            </motion.div>

            {/* About me */}
            <motion.div
                className="space-y-2 relative"
                key={7}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Label htmlFor="about" className="text-sm text-foreground font-medium">
                    About
                </Label>
                <div className="relative">
                    <Textarea
                        id="about"
                        autoComplete="off"
                        placeholder="About"
                        {...register("about")}
                        className="text-foreground font-medium h-[145px] resize-none placeholder:text-[14.5px]"
                    />
                </div>
            </motion.div>

            {/* Skills */}
            <motion.div
                className="space-y-2 relative"
                key={8}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <Label
                    htmlFor="softskills"
                    className="text-sm text-foreground font-medium"
                >
                    Soft Skills
                </Label>
                <div className="relative">
                    <Input
                        id="softskills"
                        type="text"
                        placeholder="Problem solving, Leadership"
                        autoComplete="off"
                        {...register("softSkills")}
                        className="p-5 pl-9 text-foreground font-medium "
                    />
                    <Book className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Tech skills */}
            <motion.div
                className="space-y-2 relative"
                key={9}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <Label
                    htmlFor="techskills"
                    className="text-sm text-foreground font-medium"
                >
                    Technical Skills
                </Label>
                <div className="relative">
                    <Input
                        id="techskills"
                        type="text"
                        placeholder="Html, css"
                        autoComplete="off"
                        {...register("techSkills")}
                        className="p-5 pl-9 text-foreground font-medium "
                    />
                    <Book className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Education */}
            <motion.div
                className="space-y-2 relative"
                key={10}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
            >
                <Label
                    htmlFor="education"
                    className="text-sm text-foreground font-medium"
                >
                    Education
                </Label>
                <div className="relative">
                    <Input
                        id="education"
                        type="text"
                        placeholder="Education"
                        autoComplete="off"
                        {...register("education")}
                        className="p-5 pl-9 text-foreground font-medium "
                    />
                    <School className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Work */}
            <motion.div
                className="space-y-2 relative"
                key={11}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                <Label htmlFor="work" className="text-sm text-foreground font-medium">
                    Work
                </Label>
                <div className="relative">
                    <Input
                        id="work"
                        type="text"
                        placeholder="Work"
                        autoComplete="off"
                        {...register("work")}
                        className="p-5 pl-9 text-foreground font-medium "
                    />
                    <Building className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                </div>
            </motion.div>

            {/* Button */}
            <motion.div
                key={12}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="pt-2 w-full"
            >
                <Button
                    variant="default"
                    type="submit"
                    disabled={submiting}
                    className="w-full h-11 shadow-md disabled:cursor-not-allowed"
                >
                    {submiting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        "Save"
                    )}
                </Button>
            </motion.div>
        </motion.form>
    );
}

export default Account;
