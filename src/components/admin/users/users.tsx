import {
    EyeIcon,
    Filter,
    Search,
    MoreHorizontal,
    Plus,
    SortAsc,
    User2,
    UserRoundCheck,
    UserRoundMinus,
    Send,
    Loader2,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangeEvent, useEffect, useState } from "react";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import UserList from "@/components/common/user/user-list-card";
import CardHeader from "@/components/common/data-card/header";
import SearchFilterSort from "@/components/common/data-card/search-filter-sort";
import { cn } from "@/lib/utils";
import DrawerUsersList from "@/components/common/user/drawer-users-list";
import UserDetails from "@/components/common/user/user-details";
import AddUserSheet from "@/components/admin/users/sheet-add-user";
import { fetchData, patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { User } from "@/types/admin";
import { Student } from "@/types/coordinator";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "usehooks-ts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

    const [fetching, setFetching] = useState<boolean>(false);

    // Blocking - unblocking
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [changingStatus, setChangingStatus] = useState<boolean>(false);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: 1,
    });

    // Category
    const [category, setCategory] = useState<string>("");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Handle select
    const handleSelect = (index: number) => {
        setSelectedUser(users[index]);
    };

    // Handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Handle blocked-unblocked
    const handleStatus = () => {
        setIsBlocked(!isBlocked);
    };

    // Handle blocking-unblocking user
    const handleBlock = async (user: User) => {
        try {
            // Set blocking state
            setChangingStatus(true);

            // Send request
            const resp = await patchData(
                ApiEndpoints.CHANGE_USER_STATUS + `/${user._id}`,
                {},
                role
            );

            // Success response
            if (resp && resp.status === 200) {
                // Update user in users list
                setUsers((prevUsers: User[]) => {
                    return prevUsers.map((u) => {
                        if (u._id === user._id) {
                            return { ...u, isblock: !u.isblock };
                        }
                        return u;
                    });
                });

                // Update user in selected user, if selected
                setSelectedUser((prevUser: User | Student | null) => {
                    if (prevUser?._id === user._id) {
                        return { ...prevUser, isblock: !prevUser.isblock };
                    }
                    return prevUser;
                });

                // Remove user from users list - becuase we changed status
                setUsers((prevUsers: User[]) => {
                    return prevUsers.filter((u) => u._id !== user._id);
                });

                toast({
                    title: user.isblock
                        ? "You have unblocked this user."
                        : "You have blocked this user.",
                });

                setChangingStatus(false);
            }
        } catch (err: unknown) {
            setChangingStatus(false);
            handleCustomError(err);
        }
    };

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
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetching(true);
                setUsers([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?keyword=${search.trim()}&isBlocked=${isBlocked}&sort=${sort.key}&order=${sort.order}&category=${category}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const users = resp?.data.data;

                    // Set users
                    setTimeout(() => {
                        setUsers(users);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };
        fetchUsers();
    }, [isBlocked, search, sort, category]);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/*Left side  */}
            <div
                className="p-5 sticky z-0 top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background border border-border shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Heading */}
                <CardHeader
                    heading="Manage users"
                    count={users.length}
                    children={
                        <AddUserSheet
                            button={
                                <div
                                    className="p-2 rounded-full bg-foreground dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700 
                                text-white shadow-md"
                                >
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
                    isBlocked={isBlocked}
                    handleSearch={handleSearch}
                    hanldeStatus={handleStatus}
                    children1={
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar
                             shadow-sm dark:shadow-customBorder dark:shadow-inner"
                            >
                                <Filter className="h-4 w-4 text-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align={"end"}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <DropdownMenuLabel>Role</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => setCategory("")}
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex justify-between"
                                >
                                    <span>All</span>
                                    {category === "" && (
                                        <Check className="w-4 h-4 text-foreground" />
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setCategory("coordinator")}
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex justify-between"
                                >
                                    <span>Coordinator</span>
                                    {category === "coordinator" && (
                                        <Check className="w-4 h-4 text-foreground" />
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setCategory("instructor")}
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex justify-between"
                                >
                                    <span>Instructor</span>
                                    {category === "instructor" && (
                                        <Check className="w-4 h-4 text-foreground" />
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                    children2={
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="flex items-center justify-center w-[41.6px] rounded-lg
                                    border hover:bg-muted dark:hover:bg-sidebar 
                                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                            >
                                <SortAsc className="h-4 w-4 text-foreground" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <DropdownMenuLabel>Sort</DropdownMenuLabel>

                                {/* Checkbox for sorting order */}
                                <div className="flex items-center gap-2 py-1.5 pl-2 cursor-pointer">
                                    <Checkbox
                                        checked={sort.order === 1}
                                        onCheckedChange={() => {
                                            setSort((prev) => ({
                                                ...prev,
                                                order: prev.order === 1 ? -1 : 1,
                                            }));
                                        }}
                                        id="ascending"
                                        className="border-border"
                                    />
                                    <Label
                                        htmlFor="ascending"
                                        className="text-sm font-medium cursor-pointer w-full"
                                    >
                                        Ascending
                                    </Label>
                                </div>

                                <DropdownMenuSeparator />

                                {/* Sorting options */}
                                <DropdownMenuItem
                                    textValue="name"
                                    onClick={() =>
                                        setSort((prev) =>
                                            prev.key !== "name"
                                                ? { key: "name", order: prev.order }
                                                : prev
                                        )
                                    }
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex justify-between"
                                >
                                    <span>Name</span>
                                    <span>
                                        {sort.key === "name" && (
                                            <Check className="w-4 h-4 text-foreground" />
                                        )}
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    textValue="createdAt"
                                    onClick={() =>
                                        setSort((prev) =>
                                            prev.key !== "createdAt"
                                                ? { key: "createdAt", order: prev.order }
                                                : prev
                                        )
                                    }
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex justify-between"
                                >
                                    <span>Date</span>
                                    <span>
                                        {sort.key === "createdAt" && (
                                            <Check className="w-4 h-4 text-foreground" />
                                        )}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                />

                {/* Users lists in small screen */}
                {isSmall && (
                    <DrawerUsersList
                        fetching={fetching}
                        setUsers={setUsers as any}
                        users={users}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser as User}
                        action={handleSelect}
                        setDrawerOpen={setDrawerOpen}
                        isSmall={isSmall}
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
                                                        onClick={() => setSelectedUser(users[index])}
                                                    >
                                                        <EyeIcon />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={changingStatus}
                                                        onClick={() => handleBlock(user)}
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="text-center"
                                                    >
                                                        {user.isblock ? (
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
                                                        {user.isblock
                                                            ? changingStatus
                                                                ? "Unblocking..."
                                                                : "Unblock"
                                                            : changingStatus
                                                                ? "Blocking..."
                                                                : "Block"}
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
                        setUsers={setUsers as any}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser as User}
                        className="rounded-2xl border border-border
                        shadow-sm dark:shadow-customBorder dark:shadow-inner"
                        role="user"
                    />
                    <div
                        className="h-full p-5 rounded-2xl bg-background border border-border
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                    ></div>
                </div>
            )}
        </div>
    );
}

export default Users;
