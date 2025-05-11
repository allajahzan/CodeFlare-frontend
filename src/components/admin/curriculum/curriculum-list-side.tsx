import {
    Activity,
    CalendarRange,
    Eye,
    GraduationCap,
    Home,
    ListMinus,
    MoreHorizontal,
    Plus,
    Search,
} from "lucide-react";
import AddCurriculumModal from "./modal-add-curriculum";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import CardHeader from "@/components/common/data-toolbar/header";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ListCard from "@/components/common/other-card/list-card";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { useMediaQuery } from "usehooks-ts";
import DrawerBatchLists from "./drawer-curriculum-lists";
import { IBatch, IDomain, IWeek } from "@codeflare/common";
import Sort from "@/components/common/data-toolbar/sort";
import { useLocation, useNavigate } from "react-router-dom";
import AddDomainModal from "./modal-add-domain";

// Interface for Props
interface PropsType {
    setSelectedItem: React.Dispatch<
        React.SetStateAction<IBatch | IWeek | IDomain | null>
    >;
    selectedItem: IBatch | null;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    items: IBatch[] | IWeek[] | IDomain[] | [];
    setItems: React.Dispatch<
        React.SetStateAction<[] | IBatch[] | IWeek[] | IDomain[]>
    >;
}

// Batches list side Component
function CurriculumListSide({
    setSelectedItem,
    selectedItem,
    setDrawerOpen,
    items,
    setItems,
}: PropsType) {
    // Batch / Weeks / Domain related states
    const [newItem, setNewItem] = useState<IBatch | IWeek | IDomain | null>(null);

    // Edit modal
    const [open, setOpen] = useState<boolean>(false);

    const [fetching, setFetching] = useState<boolean>(true);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: -1,
    });

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Navigate
    const navigate = useNavigate();

    // Pathname
    const pathname = useLocation().pathname;
    const path = pathname.split("/")[pathname.split("/").length - 1];

    // Handle tabs
    const handleTabs = (text: string) => {
        navigate(`/admin/curriculum/${text}`);
    };

    // Handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Fetch items
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setFetching(true);
                setItems([]);

                // Send request
                const baseUrl =
                    path === "batches"
                        ? ApiEndpoints.SEARCH_BATCH
                        : path === "weeks"
                            ? ApiEndpoints.SEARCH_WEEK
                            : ApiEndpoints.SEARCH_DOMAIN;

                const queryParams = `?keyword=${search.trim()}&sort=${sort.key}&order=${sort.order
                    }`;

                const resp = await fetchData(`${baseUrl}${queryParams}`, role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data.data;

                    // Set items
                    setTimeout(() => {
                        setItems(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        fetchBatches();
    }, [search, sort, path]);

    // Update new batch
    useEffect(() => {
        if (newItem) {
            setItems((prevBatches: IBatch[]) => {
                return [newItem, ...prevBatches];
            });
        }
    }, [newItem]);

    // Change pointer event for body
    useEffect(() => {
        document.body.style.pointerEvents = "auto";
    }, [open]);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div className="flex flex-col gap-5">
            {/* Tabs */}
            <div className="w-full flex items-center gap-1 text-center text-sm text-foreground font-medium dark:bg-sidebar-background p-1 border shadow-sm rounded-lg">
                {["Batches", "Weeks", "Domains"].map((text, index) => {
                    return (
                        <p
                            key={index}
                            onClick={() => {
                                if (!fetching) {
                                    setItems([]);
                                    setSelectedItem(null);
                                    handleTabs(text.toLowerCase());
                                }
                            }}
                            className={cn(
                                "w-full p-0.5 py-1 px-3 rounded-md cursor-pointer",
                                path === text.toLowerCase() && "bg-muted"
                            )}
                        >
                            {text}
                        </p>
                    );
                })}
            </div>

            {/* Batches list */}
            <div
                className="p-5 sticky z-0 top-0 w-full h-[calc(100vh-166px)] flex flex-col gap-5 items-center rounded-2xl
                bg-background dark:bg-sidebar-background border shadow-sm"
            >
                {/* Heading */}
                <div className="flex flex-col gap-5 w-full">
                    <CardHeader
                        heading={`Manage ${path}`}
                        count={items.length}
                        children={
                            path !== "domains" ? (
                                <AddCurriculumModal setNewItem={setNewItem} />
                            ) : (
                                <AddDomainModal setNewItem={setNewItem} />
                            )
                        }
                    />
                </div>

                <div className="w-full flex gap-2">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="search"
                            placeholder="Search"
                            autoComplete="off"
                            required
                            value={search}
                            onChange={handleSearch}
                            className="w-full p-5 pl-9 text-foreground font-medium rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Sort */}
                    <Sort
                        sort={sort}
                        setSort={setSort}
                        sortData={["name", "createdAt"]}
                    />
                </div>

                {/* Batches list */}
                {!isSmall && (
                    <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar pb-0.5">
                        {items.length > 0 &&
                            items.map((item, index) => {
                                return (
                                    <ListCard
                                        key={item._id}
                                        index={index}
                                        text={item.name}
                                        action={() => setSelectedItem(item)}
                                        selectedItem={selectedItem}
                                        className={cn(
                                            "bg-background dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark dark:border-transparent",
                                            selectedItem?.name === item.name
                                                ? "bg-muted dark:bg-sidebar"
                                                : ""
                                        )}
                                        children1={
                                            <div className="flex items-center gap-1 text-muted-foreground font-medium text-sm">
                                                <Activity className="w-4 h-4" />
                                                {"Active"}
                                            </div>
                                        }
                                        children2={
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                                                    <MoreHorizontal className="w-4 h-4 text-foreground" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align={isSmall ? "end" : "start"}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        // setOpen(true);
                                                    }}
                                                    className={cn(
                                                        "relative",
                                                        isSmall ? "left-[13px]" : "left-0"
                                                    )}
                                                >
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedItem(item);
                                                        }}
                                                    >
                                                        <Eye /> View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ListMinus /> UnList
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        }
                                    />
                                );
                            })}

                        {/* If not items */}
                        {items.length === 0 && (
                            <NotFoundOrbit
                                MainIcon={
                                    path === "batches"
                                        ? Home
                                        : path === "weeks"
                                            ? CalendarRange
                                            : GraduationCap
                                }
                                SubIcon={fetching ? Search : Plus}
                                message={
                                    fetching
                                        ? "Please wait a moment"
                                        : `Add new ${path} to codeflare`
                                }
                                text={fetching ? "Fetching..." : `No ${path} found`}
                            />
                        )}
                    </div>
                )}

                {isSmall && (
                    <DrawerBatchLists
                        items={items}
                        setItems={setItems}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        setOpen={setOpen}
                        fetching={fetching}
                        isSmall={isSmall}
                        setDrawerOpen={setDrawerOpen}
                    />
                )}
            </div>
        </div>
    );
}

export default CurriculumListSide;
