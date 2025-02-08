import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";
import allaj from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Interface for Props
interface PropsType {
    data: { name: string; email: string; role: string; profilePic: string };
}

// User name card Component
function UserNameCard({ data }: PropsType) {
    return (
        <div className="flex items-center gap-3">
            {/* Avatar profile pic */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Avatar className="bg-background w-16 h-16 border-2">
                    {data.profilePic && (
                        <AvatarImage src={allaj} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-transparent">
                        <img src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>
            </motion.div>
            <div className="flex-1 flex-col justify-center gap-2 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-lg text-foreground font-semibold truncate">
                        {data.name}
                    </p>
                    <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                        {data.role[0].toUpperCase() + data.role.slice(1)}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-medium  tracking-wide flex items-center gap-1 w-full truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {data.email}
                </p>
            </div>
        </div>
    );
}

export default UserNameCard;
