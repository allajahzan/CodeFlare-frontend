import {
    ArrowUpAZ,
    CalendarArrowUp,
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import {
    ChangeEvent,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import UserList from "@/components/common/user/user-list-card";
import CardHeader from "@/components/common/data-card/header";
import SearchFilterSort from "@/components/common/data-card/search-filter-sort";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import DrawerUsersList from "@/components/common/user/drawer-users-list";
import UserDetails from "@/components/common/user/user-details";
import { fetchData } from "@/service/api-service";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import AddStudentSheet from "./sheet-add-student";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { IUserContext, UserContext } from "@/context/user-context";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Students Component
function Students({ setDrawerOpen }: PropsType) {
    // Students related states
    const [newStudent, setNewStudent] = useState<Student | null>(null);
    const [students, setStudents] = useState<Student[] | []>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | User | null>(
        null
    );
    const [status, setStatus] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    // User details
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Search student
    const [search, setSearch] = useState<string>("");

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // select student
    const handleSelect = (index: number) => {
        setSelectedStudent(students[index]);
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

    //     setStudents(filteredUsers);
    // }, [search, status]);

    // Add new students
    useEffect(() => {
        if (newStudent) {
            setStudents((prevStudents: Student[]) => {
                return [...prevStudents, newStudent];
            });
            setNewStudent(null);
        }
    }, [newStudent]);

    // Fetch students
    useLayoutEffect(() => {
        const fetchStudents = async () => {
            try {
                setFetching(true);

                // Send request
                const resp = await fetchData(ApiEndpoints.GET_STUDENTS, role);

                const users = resp?.data.data;

                // Success response
                if (resp && resp.status === 200) {
                    setTimeout(() => {
                        // Set students
                        setStudents(users);

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
        fetchStudents();
    }, []);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side  */}
            <div
                className="p-5 sticky z-0 top-[20px] md:top-5 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
            bg-background border border-border dark:border-customBorder shadow-sm dark:shadow-customBorder dark:shadow-inner"
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
                            batches={(user as User).batches}
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
                        <Select>
                            <SelectTrigger className="w-[41.6px] h-[41.6px] flex justify-center p-0 py-5 shadow-sm">
                                <Filter className="h-4 w-4 text-foreground" />
                            </SelectTrigger>
                            <SelectContent align={isSmall ? "start" : "end"}>
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
                            <DropdownMenuTrigger className="p-3 rounded-lg border hover:bg-sidebar shadow-sm">
                                <SortAsc className="h-4 w-4 text-foreground" />
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
                        setUsers={setStudents as any}
                        users={students}
                        setSelectedUser={setSelectedStudent}
                        selectedUser={selectedStudent as Student}
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
                                    <UserList
                                        key={index}
                                        index={index}
                                        action={handleSelect}
                                        user={student}
                                        selectedUser={selectedStudent}
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
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedStudent(students[index])}
                                                    >
                                                        <EyeIcon />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        {student.isBlock ? (
                                                            <UserRoundCheck />
                                                        ) : (
                                                            <UserRoundMinus />
                                                        )}
                                                        {student.isBlock ? "Unblock" : "Block"}
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
                        selectedUser={selectedStudent as Student}
                        className="rounded-2xl border border-border dark:border-customBorder 
                        shadow-sm dark:shadow-customBorder dark:shadow-inner"
                        role="student"
                    />
                    <div
                        className="h-full p-5 rounded-2xl bg-background border border-border dark:border-customBorder 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                    ></div>
                </div>
            )}
        </div>
    );
}

export default Students;
