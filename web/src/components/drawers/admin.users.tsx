import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { User } from "@/pages/admin/users";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Calendar,
    CircleUserRound,
    Clock,
    Edit,
    Edit2,
    Mail,
    MoreHorizontal,
    PersonStanding,
    User2,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import image from "../../assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotFoundOrbit, NotSelected } from "../animated/fallbacks";
import Button from "../ui/button";
import { Badge } from "../ui/badge";

interface PropsType {
    users: User[];
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    action: (index: number) => void;
    selectedUser: User;
    isSmall: boolean;
}

function DrawerUsersList({
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
                                        selectedUser?.id === user.id ? "bg-muted border-muted" : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="border-2 border-zinc-100 w-12 h-12">
                                            <AvatarImage src={image} className="object-cover" />
                                            <AvatarFallback>
                                                <CircleUserRound />
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
                {users.length === 0 && (
                    <NotFoundOrbit
                        Icon={User2}
                        message="No instructors and coordinators are added"
                        text="No users found"
                    />
                )}
            </div>

            {/* selected user details */}
            <DrawerContent className="will-change-auto">
                <AnimatePresence mode="wait">
                    {selectedUser && (
                        <motion.div
                            key={selectedUser.id}
                            initial={{ opacity: 1, x: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                            }}
                            className="h-full w-full min-w-0"
                        >
                            <div className="h-full p-5 space-y-5 bg-white overflow-hidden">
                                <div className="flex items-center gap-4 relative">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Avatar className="border-2 border-zinc-100 w-16 h-16">
                                            <AvatarImage src={image} className="object-cover" />
                                            <AvatarFallback>
                                                <CircleUserRound />
                                            </AvatarFallback>
                                        </Avatar>
                                    </motion.div>
                                    <div className="flex-1 flex flex-col justify-center gap-2 min-w-0 truncate">
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold truncate">
                                                {selectedUser.name}
                                            </p>
                                            <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 hover:bg-zinc-900 rounded-full overflow-hidden">
                                                {selectedUser.role}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium truncate tracking-wide flex items-center gap-1">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            {selectedUser.email}
                                        </p>
                                    </div>

                                    <Button
                                        action={() => alert("Edit")}
                                        className="bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-full self-start"
                                        Icon={Edit2}
                                    />
                                </div>

                                {/* cards */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 col-auto gap-[13px]">
                                    {[
                                        {
                                            icon: selectedUser.isBlock
                                                ? UserRoundMinus
                                                : UserRoundCheck,
                                            label: "Role Status",
                                            value: selectedUser.isBlock ? "Blocked" : "Active",
                                            className: "",
                                        },
                                        {
                                            icon: Clock,
                                            label: "Last Login",
                                            value: selectedUser.lastActive,
                                        },
                                        {
                                            icon: Calendar,
                                            label: "Date Joined",
                                            value: selectedUser.joined,
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground font-medium">
                                                        {item.label}{" "}
                                                        {item.label === "Role Status" && (
                                                            <span className="inline-block lg:hidden text-zinc-900">
                                                                ({selectedUser.role})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="font-semibold">{item.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* assigned batches lists */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-4 text-start cursor-pointer p-3 border rounded-lg">
                                            <div className="p-2 rounded-lg bg-muted">
                                                <PersonStanding className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Batches</p>
                                                <p className="font-semibold">Batches</p>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="max-h-[200px] overflow-auto"
                                        >
                                            <DropdownMenuItem>BCK 188</DropdownMenuItem>
                                            <DropdownMenuItem>BCK 129</DropdownMenuItem>
                                            <DropdownMenuItem>BCK 198</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* no user selected */}
                    {!selectedUser && (
                        <NotSelected
                            Icon={User2}
                            message="Select a user from the list to view their details"
                            text="No user selected"
                            className="h-[434px] lg:h-[273.3px]"
                        />
                    )}
                </AnimatePresence>
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerUsersList;
