import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Plus, Search, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import BatchesDetailsSide from "./batches-details-side";
import { motion } from "framer-motion";
import { IBatch } from "@/types/IBatch";

// Interface for Props
interface PropsType {
    batches: IBatch[] | [];
    fetching: boolean;
    selectedBatch: IBatch | null;
    setSelectedBatch: (batch: IBatch) => void;
    setBatchNameToEdit: (batch: IBatch) => void;
    setOpen: (open: boolean) => void;
    isSmall: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// Drawer batch lists Component
function DrawerBatchLists({
    batches,
    fetching,
    selectedBatch,
    setSelectedBatch,
    setBatchNameToEdit,
    setOpen,
    isSmall,
    setDrawerOpen,
}: PropsType) {
    return (
        <Drawer
            onClose={() => {
                setDrawerOpen(false);
            }}
        >
            <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar pb-0.5">
                {batches.length > 0 &&
                    batches.map((batch, index) => {
                        return (
                            <DrawerTrigger
                                key={index}
                                asChild
                                onClick={() => setDrawerOpen(true)}
                            >
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    onClick={() => setSelectedBatch(batch)}
                                    className={cn(
                                        "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border border-border hover:bg-muted dark:hover:bg-sidebar",
                                        selectedBatch?.name === batch.name
                                            ? "bg-muted dark:bg-sidebar"
                                            : ""
                                    )}
                                >
                                    <div className="flex items-center">
                                        {/* Name and other details */}
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <p className="font-semibold text-foreground truncate">
                                                {batch.name}
                                            </p>
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
                                        </div>
                                    </div>
                                </motion.div>
                            </DrawerTrigger>
                        );
                    })}

                {/* If not batches */}
                {batches.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={UsersRound}
                        SubIcon={fetching ? Search : Plus}
                        message={
                            fetching ? "Please wait a moment" : "Add new batches to codeflare"
                        }
                        text={fetching ? "Fetching..." : "No batches found"}
                    />
                )}
            </div>

            <DrawerContent>
                <BatchesDetailsSide selectedBatch={selectedBatch} />
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerBatchLists;
