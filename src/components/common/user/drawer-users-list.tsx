import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    EyeIcon,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    User2,
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
import UserDetails from "@/components/common/user/user-details";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { useLocation } from "react-router-dom";
import profile from "@/assets/images/no-profile.svg";

// Interface for Props
interface PropsType {
    fetching: boolean;
    setUsers: React.Dispatch<React.SetStateAction<[] | User[] | Student[]>>;
    users: User[] | Student[];
    setSelectedUser: React.Dispatch<React.SetStateAction<User | Student | null>>;
    selectedUser: User | Student;
    action: (index: number) => void;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSmall: boolean;
}

// Drawer Users List Component
function DrawerUsersList({
    fetching,
    setUsers,
    users,
    setSelectedUser,
    selectedUser,
    action,
    setDrawerOpen,
    isSmall,
}: PropsType) {
    // Get role
    const pathname = useLocation().pathname;
    const role = pathname.split("/")[2];

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
                                        "group p-2 px-3 w-full rounded-xl cursor-pointer border border-border dark:border-customBorder hover:bg-muted dark:hover:bg-sidebar",
                                        selectedUser?._id === user._id
                                            ? "bg-muted dark:bg-sidebar"
                                            : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar profile pic */}
                                        <Avatar className="border-2 bg-background w-12 h-12">
                                            {user.profilePic && (
                                                <AvatarImage src={image} className="object-cover" />
                                            )}
                                            <AvatarFallback className="bg-transparent">
                                                <img className="w-full" src={profile} alt="" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-foreground font-semibold truncate">
                                                    {user.name}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                {user.role[0].toUpperCase() + user.role.slice(1)}
                                            </p>
                                        </div>

                                        {/* Dropdown menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4 text-foreground" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                // Change alignments in small size
                                                align={isSmall ? "end" : "start"}
                                                className={cn(
                                                    "relative",
                                                    isSmall ? "left-[13px]" : "left-0"
                                                )}
                                            >
                                                <DropdownMenuItem>
                                                    <Send />
                                                    Send Invitation
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setDrawerOpen(true);
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <EyeIcon />
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={(event) => event.stopPropagation()}
                                                >
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
                        SubIcon={fetching ? Search : Plus}
                        message={
                            fetching
                                ? "Please wait a moment"
                                : role === "students"
                                    ? "Add new students to the batch"
                                    : "Add new users to codeflare"
                        }
                        text={
                            fetching
                                ? "Fetching..."
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
                    setUsers={setUsers}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                    role={role === "students" ? "student" : "user"}
                />
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerUsersList;
