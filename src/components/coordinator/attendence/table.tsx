import { cn } from "@/lib/utils";
import {
    CalendarClock,
    CalendarCogIcon,
    Camera,
    Clock,
    Dot,
    FileSpreadsheetIcon,
    Hourglass,
    LogOut,
    Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import profile from "@/assets/images/no-profile.svg";
import { motion } from "framer-motion";
import UserNameCard from "@/components/common/user/user-name-card";
import InfoCard from "@/components/common/other-cards/info-card";
import { Badge } from "@/components/ui/badge";
import CardHeader from "@/components/common/data-card/header";
import CalendarHeaderForInstrucor from "./header-instructor";
import SelfieModal from "./selfie-modal";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { convertTo12HourFormat } from "@/utils/time-converter";

interface Propstype {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;
}

// Component
function Table({
    currentDate,
    onNextMonth,
    view,
    setView,
    onPreviousMonth,
}: Propstype) {
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
                <CardHeader count={4} heading="Attedence list" />

                {/* Filter and view */}
                <CalendarHeaderForInstrucor
                    currentDate={currentDate}
                    onPreviousMonth={onPreviousMonth}
                    onNextMonth={onNextMonth}
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
                                                case "Late":
                                                    return (
                                                        <div className="p-1 rounded-full bg-purple-400/40 group-hover:bg-purple-400/50"></div>
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
                    <div className="w-full relative p-5 flex flex-col gap-3 border bg-background dark:bg-sidebar-background rounded-2xl shadow-sm overflow-hidden">
                        {/* Student info */}
                        <div className="flex items-center justify-between mb-2">
                            <UserNameCard
                                data={{
                                    name: selectedAttendence.user.name,
                                    email: selectedAttendence.user.email,
                                    role: selectedAttendence.user.role,
                                    profilePic: selectedAttendence.user.profilePic,
                                }}
                            />

                            <Badge
                                className={cn(
                                    "self-start text-sm font-semibold rounded-full duration-0",
                                    selectedAttendence.status === "Present"
                                        ? "text-green-600 bg-green-400/20 hover:bg-green-400/30"
                                        : selectedAttendence.status === "Absent"
                                            ? "text-red-600 bg-red-400/20 hover:bg-red-400/30"
                                            : "text-yellow-600 bg-yellow-400/20 hover:bg-yellow-400/30"
                                )}
                            >
                                {selectedAttendence.status || "Pending"}
                            </Badge>
                        </div>

                        {/* Time line*/}
                        <p className="text-start text-base w-full flex items-center gap-1">
                            Timeline
                        </p>

                        {/* Time and duration info cards */}
                        <div className="min-h-min w-full flex gap-3 overflow-scroll overflow-y-hidden no-scrollbar">
                            {/* CheckIn */}
                            <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={LogOut}
                                    label="Check-In Time"
                                    text={
                                        selectedAttendence.checkIn
                                            ? convertTo12HourFormat(
                                                selectedAttendence.checkIn as string
                                            )
                                            : "-"
                                    }
                                    iconClassName="text-green-600"
                                    iconDivClassName="bg-green-400/20 group-hover:bg-green-400/30"
                                    className="w-full border-none bg-transparent"
                                />
                            </div>

                            {/* CheckOut */}
                            <div className="min-w-[250px] w-full  min-h-min bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200 dark:bg-pink-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={LogOut}
                                    label="Check-Out Time"
                                    text={
                                        selectedAttendence.checkOut
                                            ? convertTo12HourFormat(
                                                selectedAttendence.checkOut as string
                                            )
                                            : "-"
                                    }
                                    iconClassName="text-pink-600"
                                    iconDivClassName="bg-pink-400/20 group-hover:bg-pink-400/30 rotate-180"
                                    className="w-full border-none bg-transparent"
                                />
                            </div>

                            {/* Duration */}
                            <div className="min-w-[250px] w-full min-h-min bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-700/20 rounded-bl-full opacity-50"></div>
                                <InfoCard
                                    Icon={Hourglass}
                                    label="Duration"
                                    text={
                                        selectedAttendence.checkIn && selectedAttendence.checkOut
                                            ? (
                                                Number(selectedAttendence.checkOut.split(":")[0]) -
                                                Number(selectedAttendence.checkIn.split(":")[0])
                                            ).toString() + " Hours"
                                            : "-"
                                    }
                                    iconClassName="text-purple-600"
                                    iconDivClassName="bg-purple-400/20 group-hover:bg-purple-400/30"
                                    className="w-full border-none bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Break */}
                        <p className="text-start text-base w-full flex items-center gap-1">
                            Break snapshots
                        </p>

                        {/* Selfie updated with modal */}
                        <SelfieModal
                            children={
                                <div>
                                    <InfoCard
                                        Icon={Camera}
                                        label="Attendence"
                                        text="Break snapshots"
                                        iconClassName="text-blue-600"
                                        iconDivClassName="bg-blue-400/20 group-hover:bg-blue-400/30"
                                        className="w-full shadow-sm dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                                    />
                                </div>
                            }
                            selectedAttedence={selectedAttendence}
                        />

                        {/* Reason */}
                        <p className="text-start text-base w-full flex items-center gap-1">
                            Reason
                        </p>

                        {/* Reason */}

                        <Accordion type="single" collapsible>
                            <AccordionItem
                                value="item-1"
                                className="border-b-0 relative flex flex-col"
                            >
                                <AccordionTrigger>
                                    <InfoCard
                                        Icon={FileSpreadsheetIcon}
                                        label="Absent / Late"
                                        text="Reason"
                                        iconClassName="text-orange-600"
                                        iconDivClassName="bg-orange-400/20 group-hover:bg-orange-400/30"
                                        className="w-full shadow-sm dark:border-transparent dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark"
                                    />
                                </AccordionTrigger>
                                <AccordionContent className="mt-3">
                                    {selectedAttendence.reason.time && (
                                        <div className="relative flex flex-col gap-3 p-5 border dark:border-transparent bg-background dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark rounded-lg">
                                            {/* Time */}
                                            <div className="space-y-2 relative text-start">
                                                {/* Label */}
                                                <Label className="text-sm text-foreground font-medium">
                                                    Time
                                                </Label>

                                                {/* Time */}
                                                <div className="relative">
                                                    <Input
                                                        id="time"
                                                        type="text"
                                                        placeholder="Time"
                                                        readOnly
                                                        required
                                                        defaultValue={convertTo12HourFormat(
                                                            selectedAttendence.reason.time
                                                        )}
                                                        className="text-foreground font-medium p-5 pl-9 border"
                                                    />
                                                    <Clock className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                                                </div>
                                            </div>

                                            {/* Reason */}
                                            <div className="space-y-2 relative text-start">
                                                {/* Label */}
                                                <Label className="text-sm text-foreground font-medium">
                                                    Reason
                                                </Label>

                                                {/* Time */}
                                                <div className="relative">
                                                    <Textarea
                                                        placeholder="Reason"
                                                        readOnly
                                                        rows={3}
                                                        defaultValue={selectedAttendence.reason.description}
                                                        className="text-foreground font-medium border bg-background resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* If no reason */}
                                    {!selectedAttendence.reason?.time && (
                                        <p className="text-start text-sm font-medium">
                                            {selectedAttendence.status === "Absent" ? (
                                                "Reason not submitted"
                                            ) : (
                                                <>Not needed</>
                                            )}
                                        </p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}

                {/* No attendence selected */}
                {!selectedAttendence && (
                    <NotSelected
                        MainIcon={CalendarClock}
                        message="Select an attendence to view it's details"
                        text="No attendence selected"
                        className="h-[457.5px]"
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
