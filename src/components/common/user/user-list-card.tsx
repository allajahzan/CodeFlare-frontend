import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";
import profile from "@/assets/images/no-profile.svg";
import { IStudent } from "@/types/IStudent";
import { IUser } from "@/types/IUser";

// Interface for Props
interface PropsType {
    index: number;
    action?: any;
    user: IUser | IStudent | any;
    children1?: React.ReactNode;
    children2?: React.ReactNode;
    selectedUser?: any;
    className?: string;
}

// UsersList Component
function UserListCard({
    index,
    action,
    user,
    selectedUser,
    children1,
    children2,
    className,
}: PropsType) {
    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => action(index)}
            className={cn(
                "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border border-border hover:bg-muted dark:hover:bg-sidebar shadow-sm",
                selectedUser?._id === user._id ? "bg-muted dark:bg-sidebar" : "",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {/* Avatar profile pic */}
                <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                    <AvatarImage src={user.profilePic} className="object-cover" />
                    <AvatarFallback className="bg-transparent">
                        <img className="w-full" src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>

                {/* Name and other details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">
                            {user.name}
                        </p>
                    </div>
                    {children1}
                </div>
                {children2}
            </div>
        </motion.div>
    );
}

export default UserListCard;
