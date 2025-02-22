import {
    Check,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    SortAsc,
    UsersRound,
} from "lucide-react";
import AddBatchModal from "./modal-add-batch";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import EditBatchModal from "./modal-edit-batch";
import { IBatch } from "./batches";
import CardHeader from "@/components/common/data-card/header";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import ListCard from "@/components/common/other-cards/list-card";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "usehooks-ts";
import DrawerBatchLists from "./drawer-batch-lists";

// Interface for Props
interface PropsType {
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
    selectedBatch: IBatch | null;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Batches list side Component
function BatchesListSide({
    setSelectedBatch,
    selectedBatch,
    setDrawerOpen,
}: PropsType) {
    // Batch related states
    const [batches, setBatches] = useState<IBatch[] | []>([]);
    const [newBatch, setNewBatch] = useState<IBatch | null>(null);

    // Edit modal
    const [open, setOpen] = useState<boolean>(false);
    const [batchToEdit, setBatchNameToEdit] = useState<IBatch | null>(null);

    const [fetching, setFetching] = useState<boolean>(true);

    // Search
    const [search, setSearch] = useState<string>("");

    // Sort
    const [sort, setSort] = useState<{ key: string; order: number }>({
        key: "createdAt",
        order: 1,
    });

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // Handle search
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Fetch batches
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setFetching(true);
                setBatches([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_BATCH +
                    `?keyword=${search.trim()}&sort=${sort.key}&order=${sort.order}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data.data;

                    // Set batches
                    setTimeout(() => {
                        setBatches(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        fetchBatches();
    }, [search, sort]);

    // Update new batch
    useEffect(() => {
        if (newBatch) {
            setBatches((prevBatches: IBatch[]) => {
                return [...prevBatches, newBatch];
            });
        }
    }, [newBatch]);

    // Changeg pointer event for body
    useEffect(() => {
        document.body.style.pointerEvents = "auto";
    }, [open]);

    // Close drawer on screen size change
    useEffect(() => {
        setDrawerOpen(false);
    }, [isSmall]);

    return (
        <div
            className="p-5 sticky z-0 top-0 w-full h-[calc(100vh-108px)] flex flex-col gap-5 items-center rounded-2xl
    bg-background border border-border shadow-sm dark:shadow-customBorder dark:shadow-inner"
        >
            {/* Heading */}
            <CardHeader
                heading="Manage batches"
                count={batches.length}
                children={<AddBatchModal setNewBatch={setNewBatch} />}
            />

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
                        className="w-full p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                    />
                </div>

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
                                id="ascending"
                                checked={sort.order === 1}
                                onCheckedChange={() => {
                                    setSort((prev) => ({
                                        ...prev,
                                        order: prev.order === 1 ? -1 : 1,
                                    }));
                                }}
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
            </div>

            {/* Batches list */}
            {!isSmall && (
                <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar pb-0.5">
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <ListCard
                                    key={index}
                                    index={index}
                                    text={batch.name}
                                    action={() => setSelectedBatch(batch)}
                                    selectedItem={selectedBatch}
                                    children={
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4 text-foreground" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align={isSmall ? "end" : "start"}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpen(true);
                                                }}
                                                className={cn(
                                                    "relative",
                                                    isSmall ? "left-[13px]" : "left-0"
                                                )}
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setBatchNameToEdit(batch);
                                                    }}
                                                >
                                                    <Edit /> Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    }
                                />
                            );
                        })}

                    {/* If not batches */}
                    {batches.length === 0 && (
                        <NotFoundOrbit
                            MainIcon={UsersRound}
                            SubIcon={fetching ? Search : Plus}
                            message={
                                fetching
                                    ? "Please wait a moment"
                                    : "Add new batches to codeflare"
                            }
                            text={fetching ? "Fetching..." : "No batches found"}
                        />
                    )}
                </div>
            )}

            {isSmall && (
                <DrawerBatchLists
                    batches={batches}
                    selectedBatch={selectedBatch}
                    setSelectedBatch={setSelectedBatch}
                    setOpen={setOpen}
                    setBatchNameToEdit={setBatchNameToEdit}
                    fetching={fetching}
                    isSmall={isSmall}
                    setDrawerOpen={setDrawerOpen}
                />
            )}

            {/* Edit modal */}
            <EditBatchModal
                batchToEdit={batchToEdit as IBatch}
                open={open}
                setOpen={setOpen}
                setBatches={setBatches}
            />
        </div>
    );
}

export default BatchesListSide;
