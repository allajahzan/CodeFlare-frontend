import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    EyeIcon,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    User2,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
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
import profile from "@/assets/images/no-profile.svg";
import { toast } from "@/hooks/use-toast";
import { handleCustomError } from "@/utils/error";
import { patchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

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
    // Blocking - unblocking
    const [changingStatus, setChangingStatus] = useState<boolean>(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle blocking-unblocking user
    const handleBlock = async (user: User) => {
        try {
            // Set blocking state
            setChangingStatus(true);

            // Send request
            const resp = await patchData(
                ApiEndpoints.USER_STATUS + `/${user._id}`,
                {},
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    // Update user in users list
                    setUsers((prevUsers: any) => {
                        return prevUsers.map((u: any) => {
                            if (u._id === user._id) {
                                return { ...u, isBlock: !u.isBlock };
                            }
                            return u;
                        });
                    });

                    // Update user in selected user, if selected
                    setSelectedUser((prevUser: User | Student | null) => {
                        if (prevUser?._id === user._id) {
                            return { ...prevUser, isBlock: !prevUser.isBlock };
                        }
                        return prevUser;
                    });

                    // Remove user from users list - becuase we changed status
                    setUsers((prevUsers: any[]) => {
                        return prevUsers.filter((u) => u._id !== user._id);
                    });

                    toast({
                        title: user.isBlock
                            ? "You have unblocked this user"
                            : "You have blocked this user",
                    });

                    setChangingStatus(false);
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setChangingStatus(false);
                handleCustomError(err);
            }, 1000);
        }
    };

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
                                        "group p-2 px-3 w-full rounded-xl cursor-pointer border border-border hover:bg-muted dark:hover:bg-sidebar",
                                        selectedUser?._id === user._id
                                            ? "bg-muted dark:bg-sidebar"
                                            : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar profile pic */}
                                        <Avatar className="border-2 bg-background w-12 h-12">
                                            <AvatarImage
                                                src={user.profilePic}
                                                className="object-cover"
                                            />
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
                                                onClick={(event) => event.stopPropagation()}
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
                                                    disabled={changingStatus}
                                                    onClick={() => handleBlock(user as any)}
                                                    onSelect={(e) => e.preventDefault()}
                                                    className="text-center"
                                                >
                                                    {user.isBlock ? (
                                                        changingStatus ? (
                                                            <Loader2 className="w-4 h-5 text-foreground animate-spin" />
                                                        ) : (
                                                            <UserRoundCheck />
                                                        )
                                                    ) : changingStatus ? (
                                                        <Loader2 className="w-4 h-5 text-foreground animate-spin" />
                                                    ) : (
                                                        <UserRoundMinus />
                                                    )}
                                                    {user.isBlock
                                                        ? changingStatus
                                                            ? "Unblocking..."
                                                            : "Unblock"
                                                        : changingStatus
                                                            ? "Blocking..."
                                                            : "Block"}
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
