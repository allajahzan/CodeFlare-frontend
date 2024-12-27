import {
    Activity,
    Filter,
    MoreHorizontal,
    Search,
    SortAsc,
    SortDesc,
} from "lucide-react";
import image from "../../assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Admins() {
    return (
        <div className="grid grid-cols-3 gap-4 p-5">
            {/* admins list  */}
            <div className="p-5 w-full h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white rounded-2xl shadow-custom">
                {/* Heading */}
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-base font-semibold">Manage Users</h2>
                    <Badge
                        variant="outline"
                        className="text-xs font-semibold rounded-full"
                    >
                        3 Total
                    </Badge>
                </div>

                {/* search , filter, sort */}
                <div className="w-full flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                        <input
                            placeholder="Search users..."
                            className="w-full h-full p-2 px-4 pl-9 font-medium placeholder:text-zinc-400 border rounded-lg"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-3 border rounded-lg hover:bg-zinc-100">
                            <Filter className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem className="font-medium cursor-pointer">
                                All Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-medium cursor-pointer">
                                Coordinators
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-medium cursor-pointer">
                                Instructors
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button className="p-3 border rounded-lg">
                        {"asc" === "asc" ? (
                            <SortAsc className="h-5 w-5" />
                        ) : (
                            <SortDesc className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* users lists */}
                {/* <div className="p-4 w-full rounded-xl border">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-muted rounded" />
                            <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                    </div>
                </div> */}
                <div className="p-4 w-full cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-primary/20">
                            <AvatarImage src={image} alt={"Allaj"} className="object-cover" />
                            <AvatarFallback>ALlaj</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{"admin.name"}</p>
                                <Badge
                                    variant={
                                        "Super Admin" === "Super Admin" ? "default" : "secondary"
                                    }
                                    className="hidden sm:inline-flex"
                                >
                                    Admin
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Activity className="w-3 h-3" />1 min ago
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="shrink-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    Remove Admin
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admins;
