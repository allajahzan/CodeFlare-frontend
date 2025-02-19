import CardHeader from "@/components/common/data-card/header";
import { cn } from "@/lib/utils";
import { Edit, MoreHorizontal, Plus, Search, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddBatchModal from "@/components/admin/batch/modal-add-batch";
import { useState } from "react";
import ListCard from "@/components/common/other-cards/list-card";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import EditBatchModal from "./modal-edit-batch";

function Batches() {
    // Batch related states
    const [batches, setBatches] = useState<string[] | []>([
        "Batch 1",
        "Batch 2",
        "Batch 3",
    ]);

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
                    children={<AddBatchModal />}
                />

                <div className="relative h-[52px] overflow-hidden">
                    {/* Search bar */}
                    <div className={cn("absolute inset-0 flex items-center")}>
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="search"
                            placeholder="Search"
                            autoComplete="off"
                            required
                            className="w-full p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                        />
                    </div>
                </div>

                <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar">
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <ListCard
                                    key={index}
                                    index={index}
                                    text={batch}
                                    children={
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                                                <MoreHorizontal className="w-4 h-4 text-foreground" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                onClick={(event) => event.stopPropagation()}
                                                className={cn(
                                                    "relative",
                                                    false ? "left-[13px]" : "left-0"
                                                )}
                                            >
                                                <EditBatchModal
                                                    children={
                                                        <DropdownMenuItem
                                                            onSelect={(event) => event.preventDefault()}
                                                        >
                                                            <Edit />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    }
                                                />
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
                            SubIcon={false ? Search : Plus}
                            message={
                                false ? "Please wait a moment" : "Add new batches to codeflare"
                            }
                            text={false ? "Fetching..." : "No batches found"}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Batches;
