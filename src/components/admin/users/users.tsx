import {
    EyeIcon,
    SearchIcon,
    MoreHorizontal,
    Plus,
    User2,
    UserRoundCheck,
    UserRoundMinus,
    Send,
    Loader2,
    FilterIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangeEvent, useEffect, useState } from "react";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import UserListCard from "@/components/common/user/user-list-card";
import CardHeader from "@/components/common/data-toolbar/header";
import { cn } from "@/lib/utils";
import DrawerUsersList from "@/components/common/user/drawer-users-list";
import UserDetails from "@/components/common/user/user-details";
import AddUserSheet from "@/components/admin/users/sheet-add-user";
import { fetchData, patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "usehooks-ts";
import { IUser } from "@/types/IUser";
import { IStudent } from "@/types/IStudent";
import Search from "@/components/common/data-toolbar/search";
import ToolTip from "@/components/common/tooltip/tooltip";
import Filter from "@/components/common/data-toolbar/filter";
import Sort from "@/components/common/data-toolbar/sort";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Users Component
function Users({ setDrawerOpen }: PropsType) {
    // Users related states
    const [newUser, setNewUser] = useState<IUser | null>(null);
    const [users, setUsers] = useState<IUser[] | []>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | IStudent | null>(
        null
    );

    const [fetching, setFetching] = useState<boolean>(false);

    // Blocking - unblocking
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [changingStatus, setChangingStatus] = useState<boolean>(false);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
    });

    // RoleWise filter
    const [roleWise, setRoleWise] = useState<string>("");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Handle select
    const handleSelect = (index: number) => {
        setSelectedUser(users[index]);
    };

    // Handle search
    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Handle blocked-unblocked
    const handleStatus = () => {
        setIsBlocked(!isBlocked);
    };

    // Handle blocking-unblocking user
    const handleBlock = async (user: IUser) => {
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
                setUsers((prevUsers: IUser[]) => {
                    return prevUsers.map((u) => {
                        if (u._id === user._id) {
                            return { ...u, isBlock: !u.isBlock };
                        }
                        return u;
                    });
                });

                // Update user in selected user, if selected
                setSelectedUser((prevUser: IUser | IStudent | null) => {
                    if (prevUser?._id === user._id) {
                        return { ...prevUser, isBlock: !prevUser.isBlock };
                    }
                    return prevUser;
                });

                // Remove user from users list - becuase we changed status
                setUsers((prevUsers: IUser[]) => {
                    return prevUsers.filter((u) => u._id !== user._id);
                });

                toast({
                    title: user.isBlock
                        ? `You have unblocked ${user.role} ${user.name}.`
                        : `You have blocked ${user.role} ${user.name}.`,
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
            setUsers((prevUsers: IUser[]) => {
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
                    `?keyword=${search.trim()}&isBlock=${isBlocked}&sort=${sort.key
                    }&order=${sort.order}&roleWise=${roleWise}`,
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
    }, [isBlocked, search, sort, roleWise]);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/*Left side  */}
            <div
                className="p-5 sticky z-0 top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background dark:bg-sidebar-background border border-border shadow-sm"
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

                {/* Search */}
                <div className="flex items-center gap-2 w-full">
                    <Search search={search} handleSearch={handleSearch} />

                    {/* Status */}
                    <ToolTip
                        action={handleStatus}
                        text={isBlocked ? "Blocked Users" : "Active Users"}
                        className=""
                        children={
                            <div
                                onClick={handleStatus}
                                className="p-3 rounded-lg border dark:hover:border-customBorder-dark bg-background hover:bg-muted dark:hover:bg-sidebar 
                                shadow-sm cursor-pointer"
                            >
                                {isBlocked ? (
                                    <UserRoundMinus className="h-4 w-4 text-foreground" />
                                ) : (
                                    <UserRoundCheck className="h-4 w-4 text-foreground" />
                                )}
                            </div>
                        }
                    />

                    {/* Filter */}
                    <Filter
                        title="Role"
                        Icon={FilterIcon}
                        filter={roleWise}
                        setFilter={setRoleWise}
                        fitlerData={["all", "coordinator", "instructor"]}
                    />

                    {/* Sort */}
                    <Sort
                        sort={sort}
                        setSort={setSort}
                        sortData={["name", "createdAt"]}
                    />
                </div>

                {/* Users lists in small screen */}
                {isSmall && (
                    <DrawerUsersList
                        fetching={fetching}
                        setUsers={setUsers as any}
                        users={users}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser as IUser}
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
                                    <UserListCard
                                        key={user._id}
                                        index={index}
                                        action={handleSelect}
                                        user={user}
                                        selectedUser={selectedUser}
                                        className="dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
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
                                                        {user.isBlock ? (
                                                            changingStatus ? (
                                                                <Loader2 className="w-4 h-4 text-foreground animate-spin" />
                                                            ) : (
                                                                <UserRoundCheck />
                                                            )
                                                        ) : changingStatus ? (
                                                            <Loader2 className="w-4 h-4 text-foreground animate-spin" />
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
                                        }
                                    />
                                );
                            })}

                        {/* If no users are there */}
                        {users.length === 0 && (
                            <NotFoundOrbit
                                MainIcon={User2}
                                SubIcon={fetching ? SearchIcon : Plus}
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
                        selectedUser={selectedUser as IUser}
                        className="rounded-2xl border border-border
                        shadow-sm"
                        role="user"
                    />
                    <div
                        className="h-full p-5 rounded-2xl bg-background dark:bg-sidebar-background border border-border
                    shadow-sm "
                    ></div>
                </div>
            )}
        </div>
    );
}

export default Users;
