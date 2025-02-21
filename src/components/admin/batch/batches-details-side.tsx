import { NotFoundOrbit, NotSelected } from "@/components/animation/fallbacks";
import SearchFilterSort from "@/components/common/data-card/search-filter-sort";
import CountCard from "@/components/common/other-cards/count-card";
import UserList from "@/components/common/user/user-list-card";
import { stateType } from "@/redux/store";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SortAsc, Check, User2, Search, Plus, School } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { IBatch } from "./batches";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";

// Interface for Props
interface Propstype {
    handleSelect: () => void;
    selectedBatch: IBatch | null;
}

// Batches details side Component
function BatchesDetailsSide({ handleSelect, selectedBatch }: Propstype) {
    // User related states
    const [users, setUsers] = useState<Student[] | User[] | []>([]);

    const [fetching, setFetching] = useState<boolean>(true);

    // Blocked - unblocked
    const [isBlocked, setIsBlocked] = useState<boolean>(false);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: 1,
    });

    // Category
    const [category, setCategory] = useState<
        "student" | "coordinator" | "instructor"
    >("coordinator");

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
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
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?keyword=${search.trim()}&isBlocked=${isBlocked}&sort=${sort.key
                    }&order=${sort.order}&category=${category}&batchId=${selectedBatch?._id
                    }`,
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
        selectedBatch && fetchUsers();
    }, [isBlocked, search, sort, category, selectedBatch]);

    return (
        <>
            {selectedBatch && (
                <div
                    className="flex flex-col gap-5 p-5 cols-span-1 lg:col-span-2 border rounded-2xl 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
                >
                    <h1 className="text-lg text-foreground font-semibold">
                        {selectedBatch.name}
                    </h1>
                    {/* Batch details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <CountCard count={1} heading="Coordinators" />
                        <CountCard count={3} heading="Instructors" />
                        <CountCard count={25} heading="Students" />
                    </div>

                    {/* Tabs */}
                    <Tabs
                        defaultValue="coordinator"
                        className="w-full h-full flex flex-col gap-5"
                    >
                        <TabsList className="grid w-full grid-cols-3 gap-3">
                            <TabsTrigger
                                onClick={() => setCategory("coordinator")}
                                value="coordinator"
                            >
                                Coordinators
                            </TabsTrigger>
                            <TabsTrigger
                                onClick={() => setCategory("instructor")}
                                value="instructor"
                            >
                                Instructors
                            </TabsTrigger>
                            <TabsTrigger
                                onClick={() => setCategory("student")}
                                value="student"
                            >
                                Students
                            </TabsTrigger>
                        </TabsList>

                        {/* Search sort filter */}
                        <SearchFilterSort
                            handleSearch={handleSearch}
                            hanldeStatus={handleStatus}
                            isBlocked={isBlocked}
                            search={search}
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

                        <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                            {users.length > 0 &&
                                users.map((user, index) => {
                                    return (
                                        <UserList
                                            key={index}
                                            index={index}
                                            action={handleSelect}
                                            user={user}
                                            children1={
                                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                    {user.role[0].toUpperCase() + user.role.slice(1)}
                                                </p>
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
                                    className="h-full"
                                />
                            )}
                        </div>
                    </Tabs>
                </div>
            )}

            {!selectedBatch && (
                <NotSelected
                    MainIcon={School}
                    message={`Select a batch to see it's details`}
                    text={`No batch selected`}
                    className="h-full col-span-2"
                />
            )}
        </>
    );
}

export default BatchesDetailsSide;
