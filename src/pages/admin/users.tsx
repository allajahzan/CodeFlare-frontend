import {
    ArrowUpAZ,
    CalendarArrowUp,
    Edit,
    EyeIcon,
    Filter,
    Loader,
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
import { NotFoundOrbit, NotSelected } from "@/components/animated/fallbacks";
import UserList from "@/components/usersList/userList";
import CardHeader from "@/components/dataCard/header";
import SearchFilterSort from "@/components/dataCard/searchFilterSort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import "./admin.css";
import DrawerUsersList from "@/components/drawers/admin.users";
import UserDetails from "@/components/contents/admin.userDetails";
import AddUserSheet from "@/components/sheets/addUserSheet";
import { fetchData } from "@/utils/apiService";
import { adminApis } from "@/api/adminApi";
import { handleCustomError } from "@/utils/error";

export interface User {
    _id: number;
    name: string;
    email: string;
    batches: string[];
    role: string;
    profilePic: string;
    isBlock: boolean;
    createdAt: string;
    lastActive: string;
    ActiviyStatus: "Normal" | "Poor" | "Average";
}

interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Users({ setDrawerOpen }: PropsType) {
    // Users related states
    const [newUser, setNewUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[] | []>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [status, setStatus] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    // Search user
    const [search, setSearch] = useState<string>("");

    // Small screen
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

    // Search filter sort
    // useLayoutEffect(() => {
    //     const trimmed = search.trim();
    //     const regex = trimmed ? new RegExp(trimmed, "i") : null;

    //     const filteredUsers = users.filter((user) => {
    //         const matchesStatus =
    //             status !== undefined ? user.isBlock === status : true;
    //         const matchesSearch = regex ? regex.test(user.name) : true;
    //         return matchesStatus && matchesSearch;
    //     });

    //     setUsers(filteredUsers);
    // }, [search, status]);

    // Add new user
    useEffect(() => {
        if (newUser) {
            setUsers((prevUsers: User[]) => {
                return [...prevUsers, newUser];
            });
            setNewUser(null);
        }
    }, [newUser]);

    // Fetch users
    useLayoutEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetching(true);

                // Send request
                const resp = await fetchData(adminApis.user);

                const users = resp?.data.data;

                // Success response
                if (resp && resp.status === 200) {
                    setTimeout(() => {
                        setUsers(users);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: any) {
                setTimeout(() => {
                    setFetching(false);
                    handleCustomError(err);
                }, 1000);
            }
        };
        fetchUsers();
    }, []);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
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
                        <AddUserSheet
                            button={
                                <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                    <Plus className="h-4 w-4" />
                                </div>
                            }
                            setNewUser={setNewUser}
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
                        fetching={fetching}
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
                                        user={user}
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

                        {/* If no users are there */}
                        {!fetching && users.length === 0 && (
                            <NotFoundOrbit
                                Icon={User2}
                                message="No instructors and coordinators are added"
                                text="No users found"
                            />
                        )}

                        {/* Loader while fetching */}
                        {fetching && users.length === 0 && (
                            <NotSelected
                                Icon={Loader}
                                IconClassName="animate-spin"
                                className="h-full"
                                text="Fetching users"
                                message="Please wait a second..."
                            />
                        )}
                    </div>
                )}
            </div>

            {/* right side */}
            {!isSmall && (
                <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                    {/* user details */}
                    <UserDetails
                        selectedUser={selectedUser as User}
                        className="border shadow-sm rounded-2xl"
                    />
                    <div className="h-full p-5 bg-zinc-0 border rounded-2xl"></div>
                </div>
            )}
        </div>
    );
}

export default Users;
