import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Edit,
    MoreHorizontal,
    Plus,
    User2,
    UserRound,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import image from "@/assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import UserDetails from "../../common/user/userDetails";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { useLocation } from "react-router-dom";

// Interface for Props
interface PropsType {
    fetching: boolean;
    users: User[] | Student[];
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | Student | null>>;
    action: (index: number) => void;
    selectedUser: User | Student;
    isSmall: boolean;
}

// Drawer Users List Component
function DrawerUsersList({
    fetching,
    users,
    selectedUser,
    isSmall,
    setDrawerOpen,
    action,
}: PropsType) {

    const pathname = useLocation().pathname;
    const role = pathname.split("/")[2]

    return (
        <Drawer
            onClose={() => {
                setDrawerOpen(false);
            }}
        >
            <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                {/* Hidden Title and Description for Accessibility */}
                <div id="drawerTitle" style={{ display: "none" }}>
                    Users List Drawer
                </div>
                <div id="drawerDescription" style={{ display: "none" }}>
                    View and manage users in the drawer interface.
                </div>

                {/* Users list */}
                {users.length > 0 &&
                    users.map((user, index) => {
                        return (
                            <DrawerTrigger
                                asChild
                                onClick={() => setDrawerOpen(true)}
                                key={index}
                            >
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    onClick={() => action(index)}
                                    className={cn(
                                        "group p-2 px-3 w-full border hover:bg-muted hover:border-muted rounded-xl cursor-pointer",
                                        selectedUser?._id === user._id
                                            ? "bg-muted border-muted"
                                            : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar profile pic */}
                                        <Avatar className="border-2 border-zinc-100 w-12 h-12">
                                            {user.profilePic && (
                                                <AvatarImage src={image} className="object-cover" />
                                            )}
                                            <AvatarFallback>
                                                <UserRound />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold truncate">{user.name}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                {user.role[0].toUpperCase() + user.role.slice(1)}
                                            </p>
                                        </div>

                                        {/* Dropdown menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-3 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                // Change alignments in small size
                                                align={isSmall ? "end" : "start"}
                                                onClick={(event) => event.stopPropagation()}
                                                className={cn(
                                                    "relative",
                                                    isSmall ? "left-[13px]" : "left-0"
                                                )}
                                            >
                                                <DropdownMenuItem onClick={() => alert("edit")}>
                                                    <Edit />
                                                    Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    {user.isBlock ? (
                                                        <UserRoundCheck />
                                                    ) : (
                                                        <UserRoundMinus />
                                                    )}
                                                    {user.isBlock ? "Unblock" : "Block"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            </DrawerTrigger>
                        );
                    })}

                {/* If no users */}
                {users.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={User2}
                        SubIcon={Plus}
                        message={
                            fetching
                                ? "Please wait a moment..."
                                : role === "students"
                                    ? "Add new student to the batch"
                                    : "Add new user to codeflare"
                        }
                        text={
                            fetching
                                ? role === "students"
                                    ? "Fetching students"
                                    : "Fetching users"
                                : role === "students"
                                    ? "No students found"
                                    : "No users found"
                        }
                    />
                )}
            </div>

            {/* Selected user details */}
            <DrawerContent className="will-change-auto">
                <UserDetails
                    selectedUser={selectedUser}
                    role={role === "students" ? "student" : "user"}
                />
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerUsersList;
