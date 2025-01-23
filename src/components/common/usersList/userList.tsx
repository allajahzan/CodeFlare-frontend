import { motion } from "framer-motion";
import image from "../../assets/images/allaj.jpeg";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { User } from "@/pages/admin/users";

// Interface for Props
interface PropsType {
    index: number;
    action: any;
    user: User;
    children1?: React.ReactNode;
    children2?: React.ReactNode;
    selectedUser: any;
    className?: string;
}

// UsersList Component
function UserList({
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
                "group p-2 px-3 w-full border hover:bg-muted hover:border-muted rounded-xl cursor-pointer",
                selectedUser?._id === user._id ? "bg-muted border-muted" : "",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="border-2 border-zinc-100 w-12 h-12">
                    {user.profilePic && (
                        <AvatarImage src={image} className="object-cover" />
                    )}
                    <AvatarFallback>
                        <UserRound className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{user.name}</p>
                    </div>
                    {children1}
                </div>
                {children2}
            </div>
        </motion.div>
    );
}

export default UserList;
