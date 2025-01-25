import {
    ArrowUpAZ,
    CalendarArrowUp,
    Edit,
    EyeIcon,
    Filter,
    Search,
    MoreHorizontal,
    Plus,
    SortAsc,
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
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import UserList from "@/components/common/user/userList";
import CardHeader from "@/components/common/dataCard/header";
import SearchFilterSort from "@/components/common/dataCard/searchFilterSort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import DrawerUsersList from "@/components/common/user/drawer.usersList";
import UserDetails from "@/components/common/user/userDetails";
import AddUserSheet from "@/components/admin/users/sheet.addUser";
import { fetchData } from "@/service/apiService";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/apiEndpoints";
import { User } from "@/types/admin";
import "../admin.css";
import { Student } from "@/types/coordinator";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Users Component
function Users({ setDrawerOpen }: PropsType) {
    // Users related states
    const [newUser, setNewUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[] | []>([]);
    const [selectedUser, setSelectedUser] = useState<User | Student | null>(null);
    const [status, setStatus] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    // Search user
    const [search, setSearch] = useState<string>("");

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Select user
    const handleSelect = (index: number) => {
        setSelectedUser(users[index]);
    };

    // Handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Handle blocked-unblocked
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
                const resp = await fetchData(ApiEndpoints.GET_COORDINATORS_AND_INSTRUCTORS);

                const users = resp?.data.data;

                // Success response
                if (resp && resp.status === 200) {
                    setTimeout(() => {
                        setUsers(users);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
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
            {/*Left side  */}
            <div className="p-5 sticky z-0 top-[20px] md:top-5 w-full h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white border shadow-sm rounded-2xl">
                {/* Heading */}
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

                {/* Search filter sort  */}
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

                {/* Users lists in small screen */}
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

                {/* Users list in large screen */}
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
                                                {user.role[0].toUpperCase() + user.role.slice(1)}
                                            </p>
                                        }
                                        children2={
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
                        {users.length === 0 && (
                            <NotFoundOrbit
                                MainIcon={User2}
                                SubIcon={fetching ? Search : Plus}
                                message={
                                    fetching
                                        ? "Please wait a moment"
                                        : "Add new users to codeflare"
                                }
                                text={fetching ? "Fetching..." : "No users found"}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Right side */}
            {!isSmall && (
                <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                    {/* User details */}
                    <UserDetails
                        selectedUser={selectedUser as User}
                        className="border shadow-sm rounded-2xl"
                        role="user"
                    />
                    <div className="h-full p-5 bg-zinc-0 border rounded-2xl"></div>
                </div>
            )}
        </div>
    );
}

export default Users;
