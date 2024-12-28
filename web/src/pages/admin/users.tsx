import {
    Activity,
    Calendar,
    CircleUserRound,
    Clock,
    Edit,
    EyeIcon,
    Filter,
    Mail,
    MoreHorizontal,
    Search,
    Shield,
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
import LightEffect from "@/components/ui/light";

function Admins() {
    const [isActive, setActive] = useState<boolean>(true);
    return (
        <div className="grid grid-cols-2 gap-5 p-5">
            {/* users list  */}
            <div className="p-5 w-full h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] flex flex-col gap-5 items-center bg-white rounded-2xl shadow-custom">
                {/* Heading */}
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Manage users</h2>
                    <Badge variant="outline" className="text-sm font-semibold">
                        3 Total
                    </Badge>
                </div>

                {/* search , filter, sort */}
                <div className="w-full flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
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
                            <UserCheck className="h-4 w-4" />
                        ) : (
                            <UserMinus className="h-4 w-4" />
                        )}
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-3 border rounded-lg hover:bg-zinc-100 hover:border-muted">
                            <Filter className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>All Roles</DropdownMenuItem>
                            <DropdownMenuItem>Coordinators</DropdownMenuItem>
                            <DropdownMenuItem>Instructors</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button className="p-3 border rounded-lg hover:bg-zinc-100 hover:border-muted">
                        {"asc" === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                        ) : (
                            <SortDesc className="h-4 w-4" />
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
                                className="group p-3 w-full cursor-pointer border hover:border-muted hover:bg-muted rounded-xl"
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
                                            <Badge className="relative hidden sm:inline-flex text-xs text-white font-semibold bg-zinc-900 rounded-full overflow-hidden">
                                                Coordinator
                                                <LightEffect color="via-white"/>
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-zinc-400 flex items-center gap-1">
                                            <Activity className="w-3 h-3" />1 min ago
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-3">
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

            {/* user details */}
            <div className="flex flex-col gap-5 p-5 shadow-custom rounded-2xl">
                {/* user name */}
                <div className="flex items-center gap-5 relative">
                    <Avatar className="border-2 border-zinc-100 w-20 h-20">
                        <AvatarImage src={image} className="object-cover" />
                        <AvatarFallback>
                            <CircleUserRound />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                        <div className="flex items-center gap-5">
                            <p className="text-xl font-semibold truncate">
                                {"Ahsan allaj pk"}
                            </p>
                            <Badge className="hidden sm:inline-flex text-sm text-white font-semibold bg-zinc-900 rounded-full"
                            >
                                Coordinator
                            </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 tracking-wider flex items-center gap-1">
                            <Mail className="w-5 h-5" />
                            ahsanallajpk22@gmail.com
                        </p>
                    </div>
                    <button className="self-start px-6 py-2 font-semibold border hover:border-muted hover:bg-muted rounded-lg">
                        Edit
                    </button>
                </div>

                {/* cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[Shield, Clock, Calendar, Activity].map((Item, index) => {
                        return (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Item className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{"label"}</p>
                                        <p className="font-semibold">{"asdf"}</p>
                                    </div>
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
