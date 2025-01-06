import {
    ArrowUpAZ,
    Calendar,
    CalendarArrowUp,
    CircleUserRound,
    Clock,
    Edit,
    Edit2,
    EyeIcon,
    Filter,
    Mail,
    MoreHorizontal,
    PersonStanding,
    Plus,
    SortAsc,
    User,
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/button";
import { NotFoundOrbit, NotSelected } from "@/components/animated/fallbacks";
import UserList from "@/components/usersList/userList";
import CardHeader from "@/components/card/cardHeader";
import SearchFilterSort from "@/components/card/searchFilterSort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import "./admin.css";
import DrawerUsersList from "@/components/drawers/admin.users";

export interface User {
    id: number;
    name: string;
    email: string;
    joined: string;
    lastActive: string;
    ActiviyStatus: "Normal" | "Poor" | "Average";
    role: string;
    isBlock: boolean;
}

const data: User[] = [
    {
        id: 1,
        name: "Ahsan allaj pk",
        email: "ahsanallajpk22@gmail.com",
        joined: "20th Jun 2024",
        lastActive: "20 hours ago",
        ActiviyStatus: "Normal",
        role: "Coordinator",
        isBlock: false,
    },
    {
        id: 2,
        name: "Amrutha H",
        email: "ammrutha22@gmail.com",
        joined: "28th Jul 2024",
        lastActive: "1 hours ago",
        ActiviyStatus: "Normal",
        role: "Instructor",
        isBlock: true,
    },
    {
        id: 3,
        name: "Jirjis",
        email: "jirjis@gmail.com",
        joined: "22th Nov 2024",
        lastActive: "20 hours ago",
        ActiviyStatus: "Normal",
        role: "Coordinator",
        isBlock: false,
    },
];

interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Users({ setDrawerOpen }: PropsType) {
    const [status, setStatus] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(data);
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // inputs
    const [search, setSearch] = useState<string>("");

    // select user
    const handleSelect = (index: number) => {
        setSelectedUser(users[index]);
    };

    // handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // handle blocked-unblocked
    const handleStatus = () => {
        setStatus(!status);
    };

    useLayoutEffect(() => {
        const trimmed = search.trim();
        const regex = trimmed ? new RegExp(trimmed, "i") : null;

        const filteredUsers = data.filter((user) => {
            const matchesStatus =
                status !== undefined ? user.isBlock === status : true;
            const matchesSearch = regex ? regex.test(user.name) : true;
            return matchesStatus && matchesSearch;
        });

        setUsers(filteredUsers);
    }, [search, status, data]);

    useEffect(() => {
        setDrawerOpen(!isSmall ? false : false);
    }, [isSmall]);

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {/* left side  */}
            <div className="p-5 sticky z-0 top-[20px] md:top-5 w-full h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white border shadow-sm rounded-2xl">
                {/* heading */}
                <CardHeader
                    heading="Manage users"
                    count={users.length}
                    children={
                        <Button
                            action={() => alert("Add")}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-full"
                            Icon={Plus}
                        />
                    }
                />

                {/* search filter sort  */}
                <SearchFilterSort
                    search={search}
                    status={status}
                    handleSearch={handleSearch}
                    hanldeStatus={handleStatus}
                    children1={
                        <DropdownMenu>
                            <DropdownMenuTrigger className="icon-style shadow-sm">
                                <Filter className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isSmall ? "end" : "start"}>
                                <DropdownMenuItem>All Roles</DropdownMenuItem>
                                <DropdownMenuItem>Coordinators</DropdownMenuItem>
                                <DropdownMenuItem>Instructors</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                    children2={
                        <DropdownMenu>
                            <DropdownMenuTrigger className="icon-style shadow-sm">
                                <SortAsc className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isSmall ? "end" : "start"}>
                                <DropdownMenuItem>
                                    <ArrowUpAZ />
                                    Name
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CalendarArrowUp />
                                    Date
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                />

                {/* users lists in small screen */}
                {isSmall && (
                    <DrawerUsersList
                        users={users}
                        selectedUser={selectedUser as User}
                        isSmall={isSmall}
                        setDrawerOpen={setDrawerOpen}
                        setSelectedUser={setSelectedUser}
                        action={handleSelect}
                    />
                )}

                {/* users list in large screen */}
                {!isSmall && (
                    <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                        {users.length > 0 &&
                            users.map((user, index) => {
                                return (
                                    <UserList
                                        key={index}
                                        index={index}
                                        action={handleSelect}
                                        data={user}
                                        selectedUser={selectedUser}
                                        children1={
                                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                {user.isBlock ? (
                                                    <UserRoundMinus className="w-3 h-3" />
                                                ) : (
                                                    <UserRoundCheck className="w-3 h-3" />
                                                )}
                                                {user.isBlock ? "Blocked" : "Active"}
                                            </p>
                                        }
                                        children2={
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
                                                        {user.isBlock ? (
                                                            <UserRoundCheck />
                                                        ) : (
                                                            <UserRoundMinus />
                                                        )}
                                                        {user.isBlock ? "Unblock" : "Block"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        }
                                    />
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
                )}
            </div>

            {/* right side */}
            {!isSmall && (
                <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                    {/* user details */}
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
                                <div className="h-full p-5 space-y-5 bg-white border shadow-sm rounded-2xl overflow-hidden">
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
                                                    <p className="text-sm text-muted-foreground">
                                                        Batches
                                                    </p>
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

                    <div className="h-full p-5 bg-zinc-0 border rounded-2xl"></div>
                </div>
            )}
        </div>
    );
}

export default Users;
