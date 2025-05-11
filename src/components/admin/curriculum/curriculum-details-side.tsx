import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
// import NotSelected from "@/components/common/fallback/not-selected";
import CountCard from "@/components/common/other-card/count-card";
import UserListCard from "@/components/common/user/user-list-card";
import { stateType } from "@/redux/store";
import {
    User2,
    Plus,
    UsersRound,
    UserRoundMinus,
    UserRoundCheck,
    SearchIcon,
    ChevronRight,
    Mail,
    Home,
    CalendarRange,
    GraduationCap,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { IStudent } from "@/types/IStudent";
import { IUser } from "@/types/IUser";
import { IBatch, IDomain, IWeek } from "@codeflare/common";
import Search from "@/components/common/data-toolbar/search";
import ToolTip from "@/components/common/tooltip/tooltip";
import Sort from "@/components/common/data-toolbar/sort";
import { Badge } from "@/components/ui/badge";
import Filter from "@/components/common/data-toolbar/filter";
import NotSelected from "@/components/common/fallback/not-selected";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import EditCurriculumModal from "./modal-edit-curriculum";
import EditDomainModal from "./modal-edit-domain";

// Interface for Props
interface Propstype {
    selectedItem: IBatch | IWeek | IDomain | null;
    setSelectedItem: React.Dispatch<
        React.SetStateAction<IBatch | IWeek | IDomain | null>
    >;
    setItems: React.Dispatch<
        React.SetStateAction<IBatch[] | IWeek[] | IDomain[]>
    >;
}

// Batches details side Component
function CurriculumDetailsSide({
    selectedItem,
    setItems,
    setSelectedItem,
}: Propstype) {
    // User related states
    const [users, setUsers] = useState<IStudent[] | IUser[] | []>([]);

    const [fetching, setFetching] = useState<boolean>(true);

    // Blocked - unblocked
    const [isBlocked, setIsBlocked] = useState<boolean>(false);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
    });

    // Category
    const [category, setCategory] = useState<string>("coordinator");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Pathname
    const pathname = useLocation().pathname;
    const path = pathname.split("/")[pathname.split("/").length - 1];

    // Handle search
    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Handle blocked-unblocked
    const handleStatus = () => {
        setIsBlocked(!isBlocked);
    };

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetching(true);
                setUsers([]);

                // Send request
                const filterQuery =
                    path === "batches"
                        ? `&roleWise=${category}`
                        : path === "weeks"
                            ? `&roleWise=${"student"}`
                            : `&roleWise=${category}`;

                const curriculumQuery =
                    path === "batches"
                        ? `&batchId=${selectedItem?._id}`
                        : path === "weeks"
                            ? `&weekId=${selectedItem?._id}`
                            : `&domainId=${selectedItem?._id}`;

                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?keyword=${search.trim()}&isBlock=${isBlocked}&sort=${sort.key
                    }&order=${sort.order}${curriculumQuery}${filterQuery}`,
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
        selectedItem && fetchUsers();
    }, [isBlocked, search, sort, category, selectedItem?._id]);

    return (
        <>
            {selectedItem && (
                <div
                    className={cn(
                        "relative z-20 h-[calc(100vh-20px)] md:h-[calc(100vh-108px)] flex flex-col gap-5 p-0 cols-span-1 lg:col-span-2",
                        isSmall && "gap-0"
                    )}
                >
                    <div
                        className={cn(
                            "flex flex-col gap-3 dark:bg-sidebar-background md:rounded-2xl md:border p-5 shadow-sm",
                            isSmall && "border-none dark:bg-transparent"
                        )}
                    >
                        {/* Heading */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                {/* Name and status */}
                                <div className="flex items-center gap-3">
                                    <div className="text-lg font-semibold text-foreground">
                                        {selectedItem.name}
                                    </div>
                                    <Badge className="relative text-xs text-green-600 font-semibold bg-green-600/20 hover:bg-green-600/20 duration-0 rounded-full overflow-hidden">
                                        Active
                                    </Badge>
                                </div>

                                {/* Edit button */}
                                {path !== "domains" ? (
                                    <EditCurriculumModal
                                        itemToEdit={selectedItem}
                                        setItems={setItems}
                                        setSelectedItem={setSelectedItem}
                                    />
                                ) : (
                                    <EditDomainModal
                                        itemToEdit={selectedItem}
                                        setItems={setItems}
                                        setSelectedItem={setSelectedItem}
                                    />
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium text-sm">
                                List of{" "}
                                {path === "batches"
                                    ? "coordinators and"
                                    : path === "weeks"
                                        ? ""
                                        : "instructors and"}{" "}
                                students in this{" "}
                                {path === "batches"
                                    ? "batch"
                                    : path === "weeks"
                                        ? "week"
                                        : "domain"}
                                . View and manage details for each.
                            </p>
                        </div>
                        {/* Batch details */}
                        <div
                            className={`grid ${path === "weeks" ? "grid-cols-1" : "grid-cols-2"
                                } gap-3`}
                        >
                            {path !== "weeks" && (
                                <CountCard
                                    count={1}
                                    heading={path === "batches" ? "Coordinaotrs" : "Instructors"}
                                    Icon={UsersRound}
                                />
                            )}
                            <CountCard count={25} heading="Students" Icon={UsersRound} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div
                        defaultValue="coordinator"
                        className={cn(
                            "h-full flex flex-col gap-3 p-5 border rounded-2xl dark:bg-sidebar-background shadow-sm",
                            isSmall && "border-none dark:bg-transparent"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Search
                                id={selectedItem._id}
                                search={search}
                                handleSearch={handleSearch}
                            />

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
                            {path !== "weeks" && (
                                <Filter
                                    filter={category}
                                    setFilter={setCategory}
                                    filterData={
                                        path === "batches"
                                            ? ["coordinator", "student"]
                                            : ["instructor", "student"]
                                    }
                                    title="Role"
                                />
                            )}

                            {/* Sort */}
                            <Sort
                                sort={sort}
                                setSort={setSort}
                                sortData={["name", "createdAt"]}
                            />
                        </div>

                        <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                            {users.length > 0 &&
                                users.map((user, index) => {
                                    return (
                                        <UserListCard
                                            key={index}
                                            index={index}
                                            user={user}
                                            className="dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark dark:border-transparent"
                                            children1={
                                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                                                    <Mail className="w-4 h-4 " />
                                                    <span>{user.email}</span>
                                                </p>
                                            }
                                            children2={
                                                <div className="flex items-center gap-1 p-2">
                                                    <ChevronRight className="w-4 h-4 text-foreground" />
                                                </div>
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
                                            : `No users are there in this ${path === "batches"
                                                ? "batch"
                                                : path === "weeks"
                                                    ? "week"
                                                    : "domain"
                                            }`
                                    }
                                    text={fetching ? "Fetching..." : "No users found"}
                                    className="h-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!selectedItem && (
                <NotSelected
                    Icon={
                        path === "batches"
                            ? Home
                            : path === "weeks"
                                ? CalendarRange
                                : GraduationCap
                    }
                    message={`Select a ${path === "batches" ? "batch" : path === "weeks" ? "week" : "domain"
                        } to see it's details`}
                    text={`No ${path === "batches" ? "batch" : path === "weeks" ? "week" : "domain"
                        } selected`}
                    className="hidden md:flex cols-span-1 lg:col-span-2"
                />
            )}
        </>
    );
}

export default CurriculumDetailsSide;
