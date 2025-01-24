import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    CalendarDaysIcon,
    Clock,
    Edit2,
    Home,
    Mail,
    PersonStanding,
    User2,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import image from "@/assets/images/allaj.jpeg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotSelected } from "@/components/animation/fallbacks";
import IconButton from "@/components/ui/iconButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { Fragment } from "react/jsx-runtime";
import profile from "@/assets/images/no-profile.svg";

interface PropsType {
    selectedUser: User | Student;
    className?: string;
}

function UserDetails({ selectedUser, className }: PropsType) {
    return (
        <AnimatePresence mode="wait">
            {selectedUser && (
                // Animated div
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
                            {/* Avatar profile pic */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Avatar className="bg-white w-16 h-16 shadow-md">
                                    {selectedUser.profilePic && (
                                        <AvatarImage src={image} className="object-cover" />
                                    )}
                                    <AvatarFallback className="bg-transparent">
                                        <img src={profile} alt="" />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            {/* Name and email */}
                            <div className="flex-1 flex flex-col justify-center gap-2 min-w-0 truncate">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold truncate">
                                        {selectedUser.name}
                                    </p>
                                    <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 hover:bg-zinc-900 rounded-full overflow-hidden">
                                        {selectedUser.role[0].toUpperCase() +
                                            selectedUser.role.slice(1)}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium truncate tracking-wide flex items-center gap-1">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    {selectedUser.email}
                                </p>
                            </div>

                            {/* Edit button */}
                            <IconButton
                                action={() => alert("Edit")}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-full self-start"
                                Icon={Edit2}
                            />
                        </div>

                        {/* More details - cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 col-auto gap-[13px]">
                            {[
                                // Active or blocked status
                                {
                                    icon: selectedUser.isBlock ? UserRoundMinus : UserRoundCheck,
                                    label: "Role Status",
                                    value: selectedUser.isBlock ? "Blocked" : "Active",
                                },

                                // Last active or week depends on role
                                {
                                    icon:
                                        selectedUser.role !== "student" ? Clock : CalendarDaysIcon,
                                    label:
                                        selectedUser.role !== "student" ? "Last Active" : "Week",
                                    value:
                                        selectedUser.role !== "student"
                                            ? selectedUser.lastActive || "Not recently"
                                            : (selectedUser as Student).week,
                                },

                                // Date joined
                                {
                                    icon: Calendar,
                                    label: "Date Joined",
                                    value: selectedUser.createdAt || "20th Jan 2025",
                                },

                                // Batch - only for student
                                selectedUser.role === "student"
                                    ? {
                                        icon: Home,
                                        label: "Batch",
                                        value: (selectedUser as Student).batch,
                                    }
                                    : null,
                            ]
                                .filter((item) => item) // Filter out null
                                .map((item, index) => (
                                    <Fragment>
                                        {item?.icon && (
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
                                                                    (
                                                                    {selectedUser.role[0].toUpperCase() +
                                                                        selectedUser.role.slice(1)}
                                                                    )
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="font-semibold">{item.value}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Fragment>
                                ))}

                            {/* Assigned batches lists for instructors and coordinators*/}
                            {selectedUser.role !== "student" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-3 text-start cursor-pointer p-3 border rounded-lg">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <PersonStanding className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Batches
                                            </p>
                                            <p className="font-semibold">Batches</p>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="max-h-[200px] overflow-auto"
                                    >
                                        {(selectedUser as User).batches.map((batch, index) => {
                                            return (
                                                <DropdownMenuItem key={index} textValue={batch}>
                                                    {batch}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* No user selected */}
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
