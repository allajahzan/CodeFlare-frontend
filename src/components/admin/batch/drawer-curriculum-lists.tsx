import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Activity,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import CurriculumDetailsSide from "./curriculum-details-side";
import { motion } from "framer-motion";
import { IBatch, IDomain, IWeek } from "@codeflare/common";
import { useLocation } from "react-router-dom";

// Interface for Props
interface PropsType {
    items: IBatch[] | IWeek[] | IDomain[] | [];
    fetching: boolean;
    selectedItem: IBatch | IWeek | IDomain | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<IBatch | IWeek | IDomain | null>>;
    setItemNameToEdit: (batch: IBatch | IWeek | IDomain) => void;
    setOpen: (open: boolean) => void;
    isSmall: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// Drawer batch lists Component
function DrawerBatchLists({
    items,
    fetching,
    selectedItem,
    setSelectedItem,
    setItemNameToEdit,
    setOpen,
    isSmall,
    setDrawerOpen,
}: PropsType) {
    // Pathname
    const pathname = useLocation().pathname;
    const path = pathname.split("/")[pathname.split("/").length - 1];

    return (
        <Drawer
            onClose={() => {
                setDrawerOpen(false);
            }}
        >
            <div className="h-full w-full flex flex-col gap-[9px] overflow-auto bg-transparent no-scrollbar pb-0.5">
                {items.length > 0 &&
                    items.map((item, index) => {
                        return (
                            <DrawerTrigger
                                key={index}
                                asChild
                                onClick={() => setDrawerOpen(true)}
                            >
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    onClick={() => setSelectedItem(item)}
                                    className={cn(
                                        "group p-2 px-4 pr-2 py-[11.15px] w-full flex flex-col rounded-lg cursor-pointer border dark:border-transparent dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark",
                                        selectedItem?.name === item.name
                                            ? "bg-muted dark:bg-sidebar"
                                            : ""
                                    )}
                                >
                                    <div className="flex items-center">
                                        {/* Name and other details */}
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-foreground truncate">
                                                    {item.name}
                                                </p>
                                                <div className="flex items-center gap-1 text-muted-foreground font-medium text-sm">
                                                    <Activity className="w-4 h-4" />
                                                    {"Active"}
                                                </div>
                                            </div>
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
                                                            setItemNameToEdit(item);
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

                {/* If not items */}
                {items.length === 0 && (
                    <NotFoundOrbit
                        MainIcon={UsersRound}
                        SubIcon={fetching ? Search : Plus}
                        message={
                            fetching ? "Please wait a moment" : `Add new ${path} to codeflare`
                        }
                        text={fetching ? "Fetching..." : `No ${path} found`}
                    />
                )}
            </div>

            <DrawerContent className="mt-5">
                <CurriculumDetailsSide selectedItem={selectedItem} />
            </DrawerContent>
        </Drawer>
    );
}

export default DrawerBatchLists;
