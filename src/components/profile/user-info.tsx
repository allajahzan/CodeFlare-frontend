import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import allaj from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { Badge } from "../ui/badge";
import { Mail, Plus } from "lucide-react";

// UserInfo Component
function UserInfo() {
    return (
        <div className="absolute w-fit top-11 sm:top-6 flex items-end px-0 sm:px-5 gap-3">
            {/* Avatar pic */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
            >
                <Avatar className="bg-background w-[90px] h-[90px] sm:w-28 sm:h-28 border-4
                border-transparent dark:border-border shadow-lg">
                    {true && <AvatarImage src={allaj} className="object-cover" />}
                    <AvatarFallback className="bg-transparent">
                        <img src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>

                {/* Add icon */}
                <div
                    className="absolute bottom-0 right-2 w-6 h-6 bg-background shadow-custom rounded-full flex items-center justify-center
                        dark:border-2 dark:border-border cursor-pointer"
                >
                    <Plus className="w-4 h-4 text-foreground" />
                </div>
            </motion.div>

            {/* User name and role */}
            <div className="flex flex-col justify-center gap-4">
                <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-2">
                        <p className="text-base sm:text-lg text-foreground font-semibold truncate">
                            Ahsan allaj pk
                        </p>
                        <Badge className="relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                            Student
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium  tracking-wide flex items-center gap-1 w-full truncate">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        ahsanallajpk@23gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
