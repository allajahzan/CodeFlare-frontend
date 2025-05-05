import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDaysIcon,
    Clock,
    Edit2,
    Home,
    PersonStanding,
    User2,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotSelected from "@/components/common/fallback/not-selected";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import EditUserSheet from "@/components/admin/users/sheet-edit-user";
import EditStudentSheet from "@/components/coordinator/students/sheet-edit-student";
import { useContext } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import UserNameCard from "./user-name-card";
import { IBatch } from "@/types/IBatch";
import { IStudent } from "@/types/IStudent";
import { IUser } from "@/types/IUser";

// Interface for Props
interface PropsType {
    setUsers: React.Dispatch<React.SetStateAction<[] | IStudent[] | IUser[]>>;
    setSelectedUser: React.Dispatch<
        React.SetStateAction<IUser | IStudent | null>
    >;
    selectedUser: IUser | IStudent;
    className?: string;
    role: string;
}

// User Details Component
function UserDetails({
    setUsers,
    selectedUser,
    setSelectedUser,
    className,
    role,
}: PropsType) {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

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
                            "h-full p-5 space-y-5 bg-background dark:bg-sidebar-background overflow-hidden",
                            className
                        )}
                    >
                        <div className="flex items-center justify-between gap-3 relative">
                            {/* User name card */}
                            <UserNameCard data={selectedUser} />

                            {/* Edit button */}
                            <div className="self-start">
                                {role === "user" ? (
                                    // Edit user
                                    <EditUserSheet
                                        button={
                                            <div
                                                className="shadow-md bg-zinc-900 dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700 
                                            text-white rounded-full p-2"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </div>
                                        }
                                        setUsers={setUsers as any}
                                        setSelectedUser={setSelectedUser as any}
                                        selectedUser={selectedUser as IUser}
                                    />
                                ) : (
                                    // Edit student
                                    <EditStudentSheet
                                        button={
                                            <div
                                                className="shadow-md bg-zinc-900 dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700
                                             text-white rounded-full p-2"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </div>
                                        }
                                        setStudents={setUsers as any}
                                        setSelectedStudent={setSelectedUser as any}
                                        selecteStudent={selectedUser as IStudent}
                                        batches={user?.batches as IBatch[]}
                                    />
                                )}
                            </div>
                        </div>

                        {/* More details - cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 col-auto gap-[13px]">
                            {[
                                // Active or blocked status
                                {
                                    icon: selectedUser.isblock ? UserRoundMinus : UserRoundCheck,
                                    label: "Role Status",
                                    value: selectedUser.isblock ? "Blocked" : "Active",
                                    iconDivClassName: selectedUser.isblock
                                        ? "bg-red-400/20 group-hover:bg-red-400/30"
                                        : "bg-blue-400/20 group-hover:bg-blue-400/30",
                                    iconClassName: selectedUser.isblock
                                        ? "text-red-600"
                                        : "text-blue-600",
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
                                            : (selectedUser as IStudent).week?.name ||
                                            (selectedUser as IStudent).category,
                                    iconDivClassName:
                                        "bg-green-400/20 group-hover:bg-green-400/30",
                                    iconClassName: "text-green-600",
                                },

                                // Date joined
                                {
                                    icon: CalendarDaysIcon,
                                    label: "Date Joined",
                                    value:
                                        new Date(selectedUser.createdAt).toLocaleDateString(
                                            "en-GB",
                                            { day: "numeric", month: "short", year: "numeric" }
                                        ) || "20th Jan 2025",
                                    iconDivClassName:
                                        "bg-orange-400/20 group-hover:bg-orange-400/30",
                                    iconClassName: "text-orange-600",
                                },

                                // Batch - only for student
                                selectedUser.role === "student"
                                    ? {
                                        icon: Home,
                                        label: "Batch",
                                        value:
                                            (selectedUser as IStudent).batch?.name ||
                                            "Not assigned",
                                        iconDivClassName:
                                            "bg-purple-400/20 group-hover:bg-purple-400/30",
                                        iconClassName: "text-purple-600",
                                    }
                                    : null,
                            ]
                                .filter((item) => item) // Filter out null
                                .map((item, index) => (
                                    <Fragment key={index}>
                                        {item?.icon && (
                                            <div
                                                className={cn(
                                                    "group bg-background dark:bg-sidebar p-3 rounded-lg border dark:border-transparent shadow-sm"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "p-2 rounded-lg",
                                                            item.iconDivClassName
                                                        )}
                                                    >
                                                        <item.icon
                                                            className={cn("w-5 h-5", item.iconClassName)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                            {item.label}{" "}
                                                            {item.label === "Role Status" && (
                                                                <span className="inline-block lg:hidden text-foreground">
                                                                    (
                                                                    {selectedUser.role[0].toUpperCase() +
                                                                        selectedUser.role.slice(1)}
                                                                    )
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-foreground font-semibold">
                                                            {item.value as string}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Fragment>
                                ))}

                            {/* Assigned batches lists for instructors and coordinators*/}
                            {selectedUser.role !== "student" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="group flex items-center gap-3 text-start rounded-lg cursor-pointer bg-background dark:bg-sidebar p-3 border dark:border-transparent shadow-sm">
                                        <div className="p-2 rounded-lg bg-purple-400/20 group-hover:bg-purple-400/30">
                                            <PersonStanding className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Batches
                                            </p>
                                            <p className="text-foreground font-semibold">Batches</p>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="max-h-[200px] overflow-auto"
                                    >
                                        {(selectedUser as IUser).batches.map((batch, index) => {
                                            return (
                                                <DropdownMenuItem key={index} textValue={batch?.name}>
                                                    {batch?.name}
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
                    Icon={User2}
                    message={`Select a ${role} from the list to view their details`}
                    text={`No ${role} selected`}
                    className="h-[434px] lg:h-[273.3px] shadow-sm"
                />
            )}
        </AnimatePresence>
    );
}

export default UserDetails;
