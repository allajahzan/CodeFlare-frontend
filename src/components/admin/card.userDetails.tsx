import { User } from "@/pages/admin/users";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Calendar,
    Clock,
    Edit2,
    Mail,
    PersonStanding,
    User2,
    UserRound,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import image from "../../assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotSelected } from "../animation/fallbacks";
import IconButton from "../ui/iconButton";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface PropsType {
    selectedUser: User;
    className?: string;
}

function UserDetails({ selectedUser, className }: PropsType) {
    return (
        <AnimatePresence mode="wait">
            {selectedUser && (
                <motion.div
                    key={selectedUser._id}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{
                        x: 0,
                        opacity: 1,
                    }}
                    className="h-full w-full min-w-0"
                >
                    <div
                        className={cn(
                            "h-full p-5 space-y-5 bg-white overflow-hidden",
                            className
                        )}
                    >
                        <div className="flex items-center gap-3 relative">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Avatar className="border-2 border-zinc-100 w-16 h-16">
                                    {selectedUser.profilePic && (
                                        <AvatarImage src={image} className="object-cover" />
                                    )}
                                    <AvatarFallback>
                                        <UserRound />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                            <div className="flex-1 flex flex-col justify-center gap-2 min-w-0 truncate">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold truncate">
                                        {selectedUser.name}
                                    </p>
                                    <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 hover:bg-zinc-900 rounded-full overflow-hidden">
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium truncate tracking-wide flex items-center gap-1">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    {selectedUser.email}
                                </p>
                            </div>

                            <IconButton
                                action={() => alert("Edit")}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-full self-start"
                                Icon={Edit2}
                            />
                        </div>

                        {/* cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 col-auto gap-[13px]">
                            {[
                                {
                                    icon: selectedUser.isBlock ? UserRoundMinus : UserRoundCheck,
                                    label: "Role Status",
                                    value: selectedUser.isBlock ? "Blocked" : "Active",
                                    className: "",
                                },
                                {
                                    icon: Clock,
                                    label: "Last Active",
                                    value: selectedUser.lastActive || '1 day ago',
                                },
                                {
                                    icon: Calendar,
                                    label: "Date Joined",
                                    value: selectedUser.createdAt || '20th jan 2025',
                                },
                            ].map((item, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {item.label}{" "}
                                                {item.label === "Role Status" && (
                                                    <span className="inline-block lg:hidden text-zinc-900">
                                                        ({selectedUser.role})
                                                    </span>
                                                )}
                                            </p>
                                            <p className="font-semibold">{item.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* assigned batches lists */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-3 text-start cursor-pointer p-3 border rounded-lg">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <PersonStanding className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Batches</p>
                                        <p className="font-semibold">Batches</p>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="max-h-[200px] overflow-auto"
                                >
                                    {selectedUser.batches.map((batch, index) => {
                                        return (
                                            <DropdownMenuItem key={index} textValue={batch}>
                                                {batch}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* no user selected */}
            {!selectedUser && (
                <NotSelected
                    MainIcon={User2}
                    message="Select a user from the list to view their details"
                    text="No user selected"
                    className="h-[434px] lg:h-[273.3px]"
                />
            )}
        </AnimatePresence>
    );
}

export default UserDetails;
