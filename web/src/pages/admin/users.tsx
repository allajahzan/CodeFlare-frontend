import {
    Activity,
    Calendar,
    CircleUserRound,
    Clock,
    Edit,
    EyeIcon,
    File,
    Filter,
    Mail,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    SortAsc,
    SortDesc,
    User,
    User2,
    UserCheck,
    UserMinus,
    UserRoundMinus,
} from "lucide-react";
import image from "../../assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import LightEffect from "@/components/ui/light";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import "./admin.css";
import NotFoundOrbit from "@/components/animated/notFoundOrbit";

interface User {
    id: number;
    name: string;
    email: string;
    joined: string;
    lastActive: string;
    ActiviyStatus: "Normal" | "Poor" | "Average";
    role: string;
    isBlock: boolean;
}
const users: User[] = [];

function Admins() {
    const [isActive, setActive] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <div className="grid grid-cols-3 gap-5 p-5">
            {/* users list  */}
            <div className="p-5 sticky top-5 w-full h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white border shadow-md rounded-2xl">
                {/* Heading */}
                <div className="w-full flex items-center justify-between">
                    <Button
                        className="bg-zinc-900 hover:bg-zinc-800 text-white"
                        text="Add new user"
                    />
                    <Badge
                        variant="outline"
                        className="text-xs font-semibold shadow-md rounded-full"
                    >
                        {users.length} Total
                    </Badge>
                </div>

                {/* search , filter, sort */}
                <div className="w-full flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search users..."
                            className="w-full h-full px-4 py-2 pl-9 font-medium placeholder:text-muted-foreground border rounded-lg"
                        />
                    </div>
                    <button onClick={() => setActive(!isActive)} className="icon-style">
                        {isActive ? (
                            <UserCheck className="h-4 w-4" />
                        ) : (
                            <UserMinus className="h-4 w-4" />
                        )}
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="icon-style">
                            <Filter className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>All Roles</DropdownMenuItem>
                            <DropdownMenuItem>Coordinators</DropdownMenuItem>
                            <DropdownMenuItem>Instructors</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button className="icon-style">
                        {"asc" === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                        ) : (
                            <SortDesc className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* users lists */}
                {/* <div className="p-4 w-full rounded-xl border">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-muted rounded" />
                            <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                    </div>
                </div> */}

                {/* lists */}
                <div className="h-full w-full flex flex-col gap-[18px] overflow-auto no-scrollbar rounded-2xl">
                    {users.length > 0 &&
                        users.map((user, index) => {
                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={index}
                                    onClick={() => setSelectedUser(users[index])}
                                    className={cn(
                                        "group p-3 w-full border rounded-xl cursor-pointer",
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
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                                <Activity className="w-3 h-3" />
                                                {user.lastActive}
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-3 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="start"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => setSelectedUser(users[index])}
                                                >
                                                    <EyeIcon />
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert("edit")}>
                                                    <Edit />
                                                    Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <UserRoundMinus />
                                                    Block
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
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
            </div>

            {/* user details */}
            <div className="grid grid-rows-[auto_1fr] gap-5 col-span-2">
                {/* user details */}
                <AnimatePresence mode="wait">
                    {selectedUser && (
                        <motion.div
                            key={selectedUser.id}
                            initial={{ opacity: 1, x: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                // transition: {
                                //     type: "spring",
                                //     stiffness: 400,
                                //     damping: 12,
                                //     duration: 0.3,
                                // },
                            }}
                            // exit={{ opacity: 0, x: -10 }}
                            className="h-fit"
                        >
                            <div className="h-full p-5 space-y-5 border shadow-md rounded-2xl overflow-hidden">
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
                                    <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                                        <div className="flex items-center gap-5">
                                            <p className="text-lg font-semibold truncate">
                                                {selectedUser.name}
                                            </p>
                                            <Badge className="relative hidden sm:inline-flex text-xs text-white font-semibold bg-zinc-900 hover:bg-zinc-900 rounded-full overflow-hidden">
                                                {selectedUser.role}
                                                {/* <LightEffect
                                                    color="via-white"
                                                    animation="animate-light"
                                                /> */}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground tracking-wider flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <Button
                                        className="bg-zinc-900 hover:bg-zinc-800 text-white self-start"
                                        text="Edit profile"
                                    />
                                </div>

                                {/* cards */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {[
                                        {
                                            icon: Shield,
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
                                        {
                                            icon: Activity,
                                            label: "Activity",
                                            value: selectedUser.ActiviyStatus,
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.label}
                                                    </p>
                                                    <p className="font-semibold">{item.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* no users found */}
                    {!selectedUser && (
                        <NotFoundOrbit
                            Icon={User2}
                            message="No instructors and coordinators are added"
                            text="No users found"
                        />
                    )}
                </AnimatePresence>
                <div className="h-full bg-zinc-100 rounded-2xl"></div>
            </div>
        </div>
    );
}

export default Admins;
