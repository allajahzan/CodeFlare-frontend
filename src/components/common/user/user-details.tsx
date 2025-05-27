import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarRangeIcon,
    Clock,
    Edit2,
    GraduationCap,
    Home,
    LucideCalendar1,
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
import { IStudent } from "@/types/IStudent";
import { IUser } from "@/types/IUser";
import { IBatch } from "@codeflare/common";
import ToolTip from "../tooltip/tooltip";

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
                                            <ToolTip
                                                text="Update User"
                                                side="left"
                                                children={
                                                    <div
                                                        className="shadow-md bg-zinc-900 dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700 
                                            text-white rounded-full p-2"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </div>
                                                }
                                            />
                                        }
                                        setUsers={setUsers as any}
                                        setSelectedUser={setSelectedUser as any}
                                        selectedUser={selectedUser as IUser}
                                    />
                                ) : (
                                    // Edit student
                                    <EditStudentSheet
                                        button={
                                            <ToolTip
                                                text="Update Student"
                                                side="left"
                                                children={
                                                    <div
                                                        className="shadow-md bg-zinc-900 dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700
                                             text-white rounded-full p-2"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </div>
                                                }
                                            />
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
                                // Active or Blocked status
                                {
                                    icon: selectedUser.isBlock ? UserRoundMinus : UserRoundCheck,
                                    label: "Status",
                                    value: selectedUser.isBlock ? "Blocked" : "Active",
                                    iconDivClassName: selectedUser.isBlock
                                        ? "bg-red-400/20 group-hover:bg-red-400/30"
                                        : "bg-blue-400/20 group-hover:bg-blue-400/30",
                                    iconClassName: selectedUser.isBlock
                                        ? "text-red-600"
                                        : "text-blue-600",
                                },

                                // Last Active for coordinator/instructor OR Week and category for student
                                selectedUser.role === "coordinator" ||
                                    selectedUser.role === "instructor"
                                    ? {
                                        icon: Clock,
                                        label: "Last Active",
                                        value: selectedUser.lastActive || "Not recently",
                                        iconDivClassName:
                                            "bg-green-400/20 group-hover:bg-green-400/30",
                                        iconClassName: "text-green-600",
                                    }
                                    : selectedUser.role === "student"
                                        ? {
                                            icon: CalendarRangeIcon,
                                            label: "Week - Category",
                                            value:
                                                ((selectedUser as IStudent).week?.name ||
                                                    "Not assigned") +
                                                " - " +
                                                (selectedUser as IStudent).category,
                                            iconDivClassName:
                                                "bg-green-400/20 group-hover:bg-green-400/30",
                                            iconClassName: "text-green-600",
                                        }
                                        : null,

                                // Date Joined coordinatorinstructor
                                selectedUser.role !== "student"
                                    ? {
                                        icon: LucideCalendar1,
                                        label: "Date Joined",
                                        value:
                                            new Date(selectedUser.createdAt).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            ) || "Unknown",
                                        iconDivClassName:
                                            "bg-orange-400/20 group-hover:bg-orange-400/30",
                                        iconClassName: "text-orange-600",
                                    }
                                    : null,

                                // Domain for instructor or student
                                selectedUser.role === "instructor" ||
                                    selectedUser.role === "student"
                                    ? {
                                        icon: GraduationCap,
                                        label: "Domain",
                                        value:
                                            (selectedUser as IStudent).domain?.name ||
                                            "Not selected",
                                        iconDivClassName:
                                            "bg-pink-400/20 group-hover:bg-pink-400/30",
                                        iconClassName: "text-pink-600",
                                    }
                                    : null,

                                // Batch only for student
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
                                                            {item.label === "Status" && (
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
                            {(selectedUser as IUser).role === "coordinator" && (
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
