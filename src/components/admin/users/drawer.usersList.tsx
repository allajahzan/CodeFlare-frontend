import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { User } from "./users";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Edit,
    Loader,
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
import UserDetails from "./userDetails";

interface PropsType {
    fetching: boolean;
    users: User[];
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    action: (index: number) => void;
    selectedUser: User;
    isSmall: boolean;
}

function DrawerUsersList({
    fetching,
    users,
    selectedUser,
    isSmall,
    setDrawerOpen,
    action,
}: PropsType) {
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
                                                {user.isBlock ? (
                                                    <UserRoundMinus className="w-3 h-3" />
                                                ) : (
                                                    <UserRoundCheck className="w-3 h-3" />
                                                )}
                                                {user.isBlock ? "Blocked" : "Active"}
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-3 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                // change alignments in small size
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
                {!fetching && users.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={User2}
                        SubIcon={Plus}
                        message="No instructors and coordinators are added"
                        text="No users found"
                    />
                )}

                {/* Loader while fetching */}
                {fetching && users.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={User2}
                        SubIcon={Loader}
                        message="Please wait a second...."
                        text="Fetching users"
                    />
                )}
            </div>

            {/* selected user details */}
            <DrawerContent className="will-change-auto">
                <UserDetails selectedUser={selectedUser as User} />
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerUsersList;
