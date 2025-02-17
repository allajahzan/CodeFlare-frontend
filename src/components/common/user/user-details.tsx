import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
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
import { NotSelected } from "@/components/animation/fallbacks";
import { cn } from "@/lib/utils";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { Fragment } from "react/jsx-runtime";
import EditUserSheet from "@/components/admin/users/sheet-edit-user";
import EditStudentSheet from "@/components/coordinator/students/sheet-edit-student";
import { useContext } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import UserNameCard from "./user-name-card";

// Interface for Props
interface PropsType {
    setUsers: React.Dispatch<React.SetStateAction<[] | Student[] | User[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | Student | null>>;
    selectedUser: User | Student;
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
                            "h-full p-5 space-y-5 bg-background overflow-hidden",
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
                                        selectedUser={selectedUser as User}
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
                                        selecteStudent={selectedUser as Student}
                                        batches={(user as any).batches}
                                    />
                                )}
                            </div>
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
                                            : (selectedUser as Student).week || "Fumigation",
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
                                    <Fragment key={index}>
                                        {item?.icon && (
                                            <div className="p-3 rounded-lg border border-border shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-muted">
                                                        <item.icon className="w-5 h-5 text-foreground" />
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
                                                            {item.value}
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
                                    <DropdownMenuTrigger
                                        className="flex items-center gap-3 text-start rounded-lg cursor-pointer p-3 border 
                                    border-border shadow-sm"
                                    >
                                        <div className="p-2 rounded-lg bg-muted">
                                            <PersonStanding className="w-5 h-5 text-foreground" />
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
                    message={`Select a ${role} from the list to view their details`}
                    text={`No ${role} selected`}
                    className="h-[434px] lg:h-[273.3px]"
                />
            )}
        </AnimatePresence>
    );
}

export default UserDetails;
