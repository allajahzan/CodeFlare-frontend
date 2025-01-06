import {
    ArrowUpAZ,
    CalendarArrowUp,
    Edit,
    EyeIcon,
    Filter,
    MoreHorizontal,
    Plus,
    SortAsc,
    User,
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
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";
import Button from "@/components/ui/button";
import { NotFoundOrbit } from "@/components/animated/fallbacks";
import UserList from "@/components/usersList/userList";
import CardHeader from "@/components/card/cardHeader";
import SearchFilterSort from "@/components/card/searchFilterSort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import "./admin.css";
import DrawerUsersList from "@/components/drawers/admin.users";
import UserDetails from "@/components/contents/admin.userDetails";

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
    const [search, setSearch] = useState<string>("");
    const isSmall = useMediaQuery("(max-width: 767.20px)");

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
                    <UserDetails selectedUser={selectedUser as User} />
                    <div className="h-full p-5 bg-zinc-0 border rounded-2xl"></div>
                </div>
            )}
        </div>
    );
}

export default Users;
