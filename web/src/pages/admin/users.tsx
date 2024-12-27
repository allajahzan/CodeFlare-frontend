import {
    Activity,
    CircleUserRound,
    Edit,
    EyeIcon,
    Filter,
    MoreHorizontal,
    Search,
    SortAsc,
    SortDesc,
    UserCheck,
    UserMinus,
    UserRoundMinus,
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
import { useState } from "react";

function Admins() {
    const [isActive, setActive] = useState<boolean>(true);
    return (
        <div className="grid grid-cols-2 gap-5 p-5">
            {/* users list  */}
            <div className="p-5 w-full h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white rounded-2xl shadow-custom">
                {/* Heading */}
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-base font-semibold">Manage Users</h2>
                    <Badge variant="secondary" className="text-sm font-semibold">
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
                    <button
                        onClick={() => setActive(!isActive)}
                        className="p-3 border rounded-lg hover:bg-zinc-100 hover:border-muted"
                    >
                        {isActive ? (
                            <UserCheck className="h-5 w-5" />
                        ) : (
                            <UserMinus className="h-5 w-5" />
                        )}
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-3 border rounded-lg hover:bg-zinc-100 hover:border-muted">
                            <Filter className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>All Roles</DropdownMenuItem>
                            <DropdownMenuItem>Coordinators</DropdownMenuItem>
                            <DropdownMenuItem>Instructors</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button className="p-3 border rounded-lg hover:bg-zinc-100 hover:border-muted">
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

                {/* lists */}
                <div className="h-full w-full flex flex-col gap-5 overflow-auto no-scrollbar">
                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => {
                        return (
                            <div
                                key={index}
                                className="p-3 w-full cursor-pointer border  rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="border-2 border-zinc-100 w-12 h-12">
                                        <AvatarImage src={image} className="object-cover" />
                                        <AvatarFallback>
                                            <CircleUserRound />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold truncate">
                                                {"Ahsan allaj pk"}
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="hidden sm:inline-flex text-xs font-bold rounded-full"
                                            >
                                                Coordinator
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-zinc-400 flex items-center gap-1">
                                            <Activity className="w-3 h-3" />1 min ago
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-3 rounded-lg hover:bg-zinc-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem>
                                                <EyeIcon />
                                                View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit />
                                                Edit Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <UserRoundMinus />
                                                Block
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

           
        </div>
    );
}

export default Admins;
