import {
    EyeIcon,
    SearchIcon,
    MoreHorizontal,
    Plus,
    User2,
    UserRoundCheck,
    UserRoundMinus,
    Loader2,
    Send,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import UserListCard from "@/components/common/user/user-list-card";
import CardHeader from "@/components/common/data-toolbar/header";
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
import { IStudent } from "@/types/IStudent";
import { IUser } from "@/types/IUser";
import Search from "@/components/common/data-toolbar/search";
import Sort from "@/components/common/data-toolbar/sort";
import Filter from "@/components/common/data-toolbar/filter";
import ToolTip from "@/components/common/tooltip/tooltip";

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
    const [selectedStudent, setSelectedStudent] = useState<
        IStudent | IUser | null
    >(null);

    const [fetching, setFetching] = useState<boolean>(false);

    // Blocking - unblocking
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [changingStatus, setChangingStatus] = useState<boolean>(false);

    // Search
    const [search, setSearch] = useState<string>("");

    // Filter
    const [category, setCategory] = useState<string>("Ongoing");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
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
                            return { ...u, isBlock: !u.isBlock };
                        }
                        return u;
                    });
                });

                // Update student in selected student, if selected
                setSelectedStudent((prevUser: IUser | IStudent | null) => {
                    if (prevUser?._id === user._id) {
                        return { ...prevUser, isBlock: !prevUser.isBlock };
                    }
                    return prevUser;
                });

                // Remove user from users list - becuase we changed status
                setStudents((prevUsers: IStudent[]) => {
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

    // Add new student
    useEffect(() => {
        if (newStudent) {
            setStudents((prevStudents: IStudent[]) => {
                return [newStudent, ...prevStudents];
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
                    `?keyword=${search}&isBlock=${isBlocked}&sort=${sort.key}&order=${sort.order}&category=${category}`,
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
    }, [isBlocked, search, sort, category]);

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
                                <ToolTip text="Add Student" side="left" children={
                                    <div className="shadow-md bg-zinc-900 hover:bg-zinc-800 text-white rounded-full p-2">
                                    <Plus className="h-4 w-4" />
                                </div>
                                }/>
                            }
                            setNewStudent={setNewStudent}
                            batches={(user as any).batches}
                        />
                    }
                />

                <div className="flex items-center gap-2 w-full">
                    {/* Search */}
                    <Search search={search} handleSearch={handleSearch} />

                    {/* Status */}
                    <ToolTip
                        action={handleStatus}
                        text={isBlocked ? "Blocked Users" : "Active Users"}
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
                        title="Category"
                        filter={category}
                        setFilter={setCategory}
                        filterData={[
                            "Foundation",
                            "Ongoing",
                            "Held",
                            "Critical",
                            "Terminated",
                            "Placement",
                            "Placed",
                        ]}
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
                                        key={student._id}
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
                                                        {student.isBlock ? (
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
                                                        {student.isBlock
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
                                SubIcon={fetching ? SearchIcon : Plus}
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
