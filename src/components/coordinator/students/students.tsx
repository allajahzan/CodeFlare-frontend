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
    Loader2,
    Send,
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import UserListCard from "@/components/common/user/user-list-card";
import CardHeader from "@/components/common/data-toolbar/header";
import SearchFilterSort from "@/components/common/data-toolbar/search-filter-sort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import DrawerUsersList from "@/components/common/user/drawer-users-list";
import UserDetails from "@/components/common/user/user-details";
import { fetchData, patchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import AddStudentSheet from "./sheet-add-student";
import { IUserContext, UserContext } from "@/context/user-context";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { IStudent } from "@/types/student";
import { IUser } from "@/types/user";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Students Component
function Students({ setDrawerOpen }: PropsType) {
    // Students related states
    const [newStudent, setNewStudent] = useState<IStudent | null>(null);
    const [students, setStudents] = useState<IStudent[] | []>([]);
    const [selectedStudent, setSelectedStudent] = useState<IStudent | IUser | null>(
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
        order: 1,
    });

    // User details
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Handle select
    const handleSelect = (index: number) => {
        setSelectedStudent(students[index]);
    };

    // handle search
    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // handle blocked-unblocked
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
                // Update students in students list
                setStudents((prevUsers: IStudent[]) => {
                    return prevUsers.map((u) => {
                        if (u._id === user._id) {
                            return { ...u, isblock: !u.isblock };
                        }
                        return u;
                    });
                });

                // Update student in selected student, if selected
                setSelectedStudent((prevUser: IUser | IStudent | null) => {
                    if (prevUser?._id === user._id) {
                        return { ...prevUser, isblock: !prevUser.isblock };
                    }
                    return prevUser;
                });

                // Remove user from users list - becuase we changed status
                setStudents((prevUsers: IStudent[]) => {
                    return prevUsers.filter((u) => u._id !== user._id);
                });

                toast({
                    title: user.isblock
                        ? "You have unblocked this student."
                        : "You have blocked this student.",
                });

                setChangingStatus(false);
            }
        } catch (err: unknown) {
            setChangingStatus(false);
            handleCustomError(err);
        }
    };

    // Add new student
    useEffect(() => {
        if (newStudent) {
            setStudents((prevStudents: IStudent[]) => {
                return [...prevStudents, newStudent];
            });
            setNewStudent(null);
        }
    }, [newStudent]);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setFetching(true);
                setStudents([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?keyword=${search}&isBlocked=${isBlocked}&sort=${sort.key}&order=${sort.order}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const users = resp?.data.data;

                    // Set students
                    setTimeout(() => {
                        setStudents(users);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };
        fetchStudents();
    }, [isBlocked, search, sort]);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side  */}
            <div
                className="p-5 sticky z-0 top-[20px] md:top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background dark:bg-sidebar-background border border-border shadow-sm"
            >
                {/* Heading */}
                <CardHeader
                    heading="Manage students"
                    count={students.length}
                    children={
                        <AddStudentSheet
                            button={
                                <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                    <Plus className="h-4 w-4" />
                                </div>
                            }
                            setNewStudent={setNewStudent}
                            batches={(user as any).batches}
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
                        <Select>
                            <SelectTrigger
                                className="w-[41.6px] h-[41.6px] flex justify-center p-0 py-5 
                                   border dark:hover:border-customBorder-dark bg-background hover:bg-muted dark:hover:bg-sidebar shadow-sm"
                            >
                                <Filter className="h-4 w-4 text-foreground" />
                            </SelectTrigger>
                            <SelectContent align={"end"}>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="ongoing">OnGoing</SelectItem>
                                    <SelectItem value="held">Held</SelectItem>
                                    <SelectItem value="placement">Placement</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }
                    children2={
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="flex items-center justify-center w-[41.6px] rounded-lg
                                    border dark:hover:border-customBorder-dark bg-background hover:bg-muted dark:hover:bg-sidebar shadow-sm"
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
                                    <label
                                        htmlFor="ascending"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Ascending
                                    </label>
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
                        setUsers={setStudents as any}
                        users={students}
                        setSelectedUser={setSelectedStudent}
                        selectedUser={selectedStudent as IStudent}
                        action={handleSelect}
                        setDrawerOpen={setDrawerOpen}
                        isSmall={isSmall}
                    />
                )}

                {/* Students list in large screen */}
                {!isSmall && (
                    <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                        {students.length > 0 &&
                            students.map((student, index) => {
                                return (
                                    <UserListCard
                                        key={index}
                                        index={index}
                                        action={() => handleSelect(index)}
                                        user={student}
                                        selectedUser={selectedStudent}
                                        className="dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
                                        children1={
                                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                {student.role[0].toUpperCase() + student.role.slice(1)}
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
                                                        onClick={() => setSelectedStudent(students[index])}
                                                    >
                                                        <EyeIcon />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={changingStatus}
                                                        onClick={() => handleBlock(student as any)}
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="text-center"
                                                    >
                                                        {student.isblock ? (
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
                                                        {student.isblock
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

                        {/* If no students are there */}
                        {students.length === 0 && (
                            <NotFoundOrbit
                                MainIcon={User2}
                                SubIcon={fetching ? Search : Plus}
                                message={
                                    fetching
                                        ? "Please wait a moment"
                                        : "Add new students to the batch"
                                }
                                text={fetching ? "Fetching..." : "No students found"}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Right side */}
            {!isSmall && (
                <div className="grid gap-5 col-auto lg:col-span-2 grid-rows-[auto_1fr] relative z-10">
                    {/* Student details */}
                    <UserDetails
                        setUsers={setStudents as any}
                        setSelectedUser={setSelectedStudent}
                        selectedUser={selectedStudent as IStudent}
                        className="rounded-2xl border border-border
                        shadow-sm"
                        role="student"
                    />
                    <div
                        className="h-full p-5 rounded-2xl bg-background dark:bg-sidebar-background border border-border
                    shadow-sm"
                    ></div>
                </div>
            )}
        </div>
    );
}

export default Students;
