import CardHeader from "@/components/common/data-card/header";
import { cn } from "@/lib/utils";
import {
    Check,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    SortAsc,
    UsersRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddBatchModal from "@/components/admin/batch/modal-add-batch";
import { ChangeEvent, useEffect, useState } from "react";
import ListCard from "@/components/common/other-cards/list-card";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import EditBatchModal from "./modal-edit-batch";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Interface for batch
export interface IBatch {
    _id: string;
    name: string;
}

function Batches() {
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
                    `?keyword=${search}&sort=${sort.key}&order=${sort.order}`,
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

    return (
        <div className="p-5 pt-0 grid grid-cols-3 gap-5">
            {/* Weeks */}
            <div
                className="h-[calc(100vh-108px)] p-5 flex flex-col gap-5 border rounded-2xl 
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Heading */}
                <CardHeader
                    heading="Manage batches"
                    count={1}
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

                            {/* Sorting options */}
                            {/* <DropdownMenuItem
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
                            </DropdownMenuItem> */}
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

                <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar pb-0.5">
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <ListCard
                                    key={index}
                                    index={index}
                                    text={batch.name}
                                    children={
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4 text-foreground" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpen(true);
                                                }}
                                                className={cn(
                                                    "relative",
                                                    false ? "left-[13px]" : "left-0"
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
            </div>

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

export default Batches;
