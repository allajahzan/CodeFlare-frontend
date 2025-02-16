import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { Badge } from "../ui/badge";
import { Loader2, Mail, Plus } from "lucide-react";
import { IUserContext, UserContext } from "@/context/user-context";
import { useContext, useState } from "react";
import { uploadImageToCloudinary } from "@/service/cloudinary";
import { patchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";

// UserInfo Component
function UserInfo() {
    // User context
    const { user, setUser } = useContext(UserContext) as IUserContext;

    //Image
    const [imageUrl, setImageUrl] = useState<string>(user?.profilePic as string);
    const [uploading, setUploading] = useState<boolean>(false);

    //  Upload profile pic
    const uploadProfilePic = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg, image/jpg";
        input.multiple = true;
        input.style.display = "none";

        input.addEventListener("change", async (event) => {
            const files = (event.target as HTMLInputElement).files;

            if (files) {
                setUploading(true);

                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = async () => {
                    // Upload image to cloudinary
                    try {
                        const imageUrl = await uploadImageToCloudinary(files[0]);

                        if (imageUrl) {
                            // Change profile pic
                            const resp = await patchData(
                                ApiEndpoints.CHANGE_PROFILE_PIC,
                                { imageUrl },
                                user?.role
                            );

                            // Success response
                            if (resp && resp.status === 200) {
                                setUploading(false);

                                // Base 64 formate
                                setImageUrl(reader.result as string);

                                // Update the local storage
                                const user = localStorage.getItem("user") || {};
                                localStorage.setItem(
                                    "user",
                                    JSON.stringify({
                                        ...JSON.parse(user as string),
                                        profilePic: imageUrl,
                                    })
                                );

                                //  Update user context
                                setUser((prevUser) => {
                                    if (prevUser) {
                                        return {
                                            ...prevUser,
                                            profilePic: imageUrl,
                                        };
                                    } else {
                                        return prevUser;
                                    }
                                });

                                toast({ title: "Successfully changed profile picture." });
                            }
                        } else {
                            setImageUrl("");
                            setUploading(false);

                            toast({ title: "Failed to changed profile picture." });
                        }
                    } catch (err: unknown) {
                        setImageUrl("");
                        setUploading(false);

                        handleCustomError(err);
                    }
                };
            }
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    return (
        <div className="absolute z-20 w-fit top-11 sm:top-7 flex items-end px-0 sm:px-5 gap-3">
            {/* Avatar pic */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
            >
                <Avatar
                    className="bg-background w-[90px] h-[90px] sm:w-28 sm:h-28 border-4
                border-transparent dark:border-border shadow-lg"
                >
                    <AvatarImage src={imageUrl} className="object-cover" />
                    <AvatarFallback className="bg-transparent">
                        <img src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>

                {/* Add icon */}
                <div
                    onClick={uploadProfilePic}
                    className="absolute bottom-0 right-2 w-6 h-6 bg-background shadow-custom rounded-full flex items-center justify-center
                        dark:border-2 dark:border-border cursor-pointer"
                >
                    {uploading ? (
                        <Loader2 className="w-4 h-5 animate-spin text-foreground" />
                    ) : (
                        <Plus className="w-4 h-4 text-foreground" />
                    )}
                </div>
            </motion.div>

            {/* User name and role */}
            <div className="flex flex-col justify-center gap-4">
                <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-2">
                        <p className="text-base sm:text-lg text-foreground font-semibold truncate">
                            {user?.name}
                        </p>
                        <Badge className="relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                            {user?.role}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium  tracking-wide flex items-center gap-1 w-full truncate">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        {user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
