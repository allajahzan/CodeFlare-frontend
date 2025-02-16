import { motion } from "framer-motion";
import image from "@/assets/images/allaj.jpeg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React, { useContext } from "react";
import { User } from "@/types/admin";
import { Student } from "@/types/coordinator";
import profileLight from "@/assets/images/no-profile.svg";
import { IThemeContext, ThemeContext } from "@/context/theme-context";

// Interface for Props
interface PropsType {
    index: number;
    action: any;
    user: User | Student | any;
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
    // Them context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => action(index)}
            className={cn(
                "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border border-border hover:bg-muted dark:hover:bg-sidebar",
                selectedUser?._id === user._id ? "bg-muted dark:bg-sidebar" : "",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {/* Avatar profile pic */}
                <Avatar className="bg-background w-12 h-12 border-2 border-background shadow-md">
                    {user.profilePic && (
                        <AvatarImage src={image} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-transparent">
                        {theme === "dark" ? (
                            <img className="w-full" src={profileLight} alt="" />
                        ) : (
                            <img className="w-full" src={profileLight} alt="" />
                        )}
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

export default UserList;
