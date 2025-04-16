import { cn } from "@/lib/utils";
import { CalendarClock, CalendarCogIcon, Dot, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import CardHeader from "@/components/common/data-card/header";
import CalenderHeader from "./header";
import PieCharts from "@/components/common/charts/pie-chart";
import { useContext, useEffect, useState } from "react";
import { handleCustomError } from "@/utils/error";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { IUserContext, UserContext } from "@/context/user-context";
import { IStudent } from "@/types/student";
import { IBatch } from "@/types/batch";
import { IAttendence } from "@/types/attendence";
import { NotFoundOrbit, NotSelected } from "@/components/animation/fallbacks";
import AttendenceDetails from "./attendence-details";
import { motion } from "framer-motion";

interface Propstype {
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;
}

// Component
function Table({ view, setView }: Propstype) {
    // Attendence states
    const [attendances, setAttendences] = useState<IAttendence[] | []>([]);
    const [selectedAttendence, setSelectedAttendence] =
        useState<IAttendence | null>(null);

    const [fetching, setFetching] = useState<boolean>(false);

    // Date
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    // Filter batch
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    // Filter student
    const [selectedStudent, setSelectedStudent] = useState<string | "">("");
    const [students, setStudents] = useState<IStudent[] | []>([]);
    const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);

    // Role
    const role = useSelector((state: stateType) => state.role);

    // User Context
    const { user } = useContext(UserContext) as IUserContext;

    // Get Attendence
    useEffect(() => {
        const fetchAttendence = async () => {
            try {
                setFetching(true);
                setAttendences([]);

                // Send request
                const resp = await fetchData(
                    ApiEndpoints.ATTENDENCE +
                    `/search?batchIds=${selectedBatch
                        ? selectedBatch._id
                        : user?.batches?.map((batch) => batch._id).join(",")
                    }&userId=${selectedStudent}&date=${selectedDate}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update attendence
                    setTimeout(() => {
                        setAttendences(data);
                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        fetchAttendence();
    }, [selectedDate, selectedBatch, selectedStudent]);

    // Fetch students based on batch
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Clear states
                setAttendences([]);
                setFetchingStudents(true);
                setStudents([]);
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?category=student&batchId=${selectedBatch?._id}`,
                    role
                );

                if (resp?.status === 200) {
                    setStudents(resp.data.data); // Update students list
                }
            } catch (err) {
                handleCustomError(err);
            } finally {
                setFetchingStudents(false); // Always set fetching to false after request
            }
        };

        if (selectedBatch) fetchUsers();
    }, [selectedBatch]);

    return (
        <div className="grid grid-cols-3 gap-5 text-center text-foreground font-semibold">
            {/* Left side*/}
            <div className="h-[calc(100vh-108px)] sticky top-0 bg-background dark:bg-sidebar-background p-5 border flex flex-col gap-5 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <CardHeader count={attendances.length} heading="Attedence list" />

                {/* Filter and view */}
                <CalenderHeader
                    view={view}
                    setView={setView}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedBatch={selectedBatch}
                    setSelectedBatch={setSelectedBatch}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    students={students}
                    fetchingStudents={fetchingStudents}
                />

                {/* Lists */}
                <div className="h-full flex flex-col items-center gap-[10px] overflow-auto no-scrollbar">
                    {/* List */}
                    {attendances.length > 0 &&
                        attendances.map((item: IAttendence, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                onClick={() => setSelectedAttendence(item)}
                                className={cn(
                                    "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border dark:border-transparent bg-background dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark",
                                    selectedAttendence?._id === item._id
                                        ? "bg-muted dark:bg-sidebar-backgroundDark"
                                        : ""
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar profile pic */}
                                    <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                                        <AvatarImage
                                            src={item.user.profilePic}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent">
                                            <img className="w-full" src={profile} alt="" />
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Name and other details */}
                                    <div className="flex-1 min-w-0 truncate">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-foreground truncate">
                                                {item.user.name}
                                            </p>
                                        </div>

                                        {/* Batch and date */}
                                        <div className="flex items-center gap-0">
                                            <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium">
                                                {/* <UsersRound className="w-3 h-3" /> */}
                                                {item.batch.name}
                                            </p>
                                            <Dot className="p-0 text-muted-foreground flex-shrink-0" />
                                            <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium">
                                                {/* <Calendar1 className="w-3 h-3" /> */}
                                                {new Date(item.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status color */}
                                    <div className="flex items-center p-2 rounded-full">
                                        {(() => {
                                            switch (item.status) {
                                                case "Pending":
                                                    return (
                                                        <div className="p-1 rounded-full bg-yellow-400/40 group-hover:bg-yellow-400/50"></div>
                                                    );
                                                case "Absent":
                                                    return (
                                                        <div className="p-1 rounded-full bg-red-400/40 group-hover:bg-red-400/50"></div>
                                                    );
                                                case "Present":
                                                    return (
                                                        <div className="p-1 rounded-full bg-green-400/40 group-hover:bg-green-400/50"></div>
                                                    );

                                                default:
                                                    return null;
                                            }
                                        })()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    {/* No attendence */}
                    {attendances && attendances.length === 0 && (
                        <NotFoundOrbit
                            MainIcon={CalendarClock}
                            SubIcon={fetching ? Search : CalendarCogIcon}
                            message={
                                fetching
                                    ? "Please wait a moment"
                                    : "No attendece are marked yet"
                            }
                            text={fetching ? "Fetching..." : "No attendence found"}
                            className="w-full"
                        />
                    )}
                </div>
            </div>

            {/* Right side */}
            <div className="h-full grid grid-rows-[auto,1fr,auto] space-y-5 col-span-2 overflow-hidden">
                {/* Scroll container*/}
                {selectedAttendence && (
                    <AttendenceDetails
                        setAttendences={setAttendences}
                        selectedAttendence={selectedAttendence}
                        setSelectedAttendence={setSelectedAttendence}
                    />
                )}

                {/* No attendence selected */}
                {!selectedAttendence && (
                    <NotSelected
                        MainIcon={CalendarClock}
                        message="Select an attendence to view it's details"
                        text="No attendence selected"
                        className="h-[458px]"
                    />
                )}

                {/* Graphs */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Pie graph */}
                    <div className="w-full h-fit bg-background dark:bg-sidebar-background text-start p-5 border rounded-2xl">
                        <PieCharts
                            data={[
                                { name: "Present", value: 50 },
                                { name: "Absent", value: 20 },
                                { name: "Pending", value: 15 },
                            ]}
                            text="Today's overview"
                            className="h-[220px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
