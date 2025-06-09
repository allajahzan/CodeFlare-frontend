import { useContext, useEffect, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import Calendar from "./calender";
import AttendenceInfoModal from "./modal-attendence-info";
import CalenderHeader from "./header";
import { handleCustomError } from "@/utils/error";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { IUserContext, UserContext } from "@/context/user-context";
import { IAttendence } from "@/types/IAttendence";

// Interface for Event
export interface IEvent {
    date: string;
    status: string;
    notes: string;
    checkIn: string | null;
    checkOut: string | null;
    reason: string | null;
}

// Attendence list Component
function Attendence() {
    // Date related states
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAttendence, setSelectedAttendence] = useState<IEvent | null>(
        null
    );

    // Attendence data
    const [attendanceData, setAttendenceData] = useState<Record<string, IEvent>>(
        {}
    );

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    //  Previous month
    const handlePreviousMonth = () => {
        setCurrentDate((prev) => subMonths(prev, 1));
    };

    // Next month
    const handleNextMonth = () => {
        setCurrentDate((prev) => addMonths(prev, 1));
    };

    // Select a date
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    // Transform attendence data to map
    const transformAttendanceData = (attendances: IAttendence[]) => {
        const attendanceData: Record<string, IEvent> = {};

        attendances.forEach((entry) => {
            const dateObj = new Date(entry.date);
            const formattedDate = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

            attendanceData[formattedDate] = {
                date: formattedDate,
                status: entry.status.toLowerCase(),
                notes:
                    entry.reason && entry.reason.description
                        ? "Reported with reason"
                        : entry.status === "Present" || entry.status === "Pending"
                            ? "No need of report"
                            : "No report",
                checkIn: entry.checkIn ? `${entry.checkIn}` : null,
                checkOut: entry.checkOut ? `${entry.checkOut}` : null,
                reason: entry.reason && entry.reason.description,
            };
        });

        return attendanceData;
    };

    // Click on date
    useEffect(() => {
        if (selectedDate) {
            const dateStr = format(selectedDate as Date, "yyyy-MM-dd");
            setSelectedAttendence(attendanceData[dateStr]);
        }
    }, [selectedDate]);

    // Clear event when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setSelectedAttendence(null);
        }
    }, [isModalOpen]);

    // Fetch attendence
    useEffect(() => {
        const fetchAttendence = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.ATTENDENCE +
                    `?userId=${user?._id}&month=${currentDate.getMonth() + 1
                    }&year=${currentDate.getFullYear()}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Set attendence data
                    setAttendenceData(transformAttendanceData(data));
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        fetchAttendence();
    }, [currentDate]);

    return (
        <div
            className={`w-full h-full flex flex-col gap-5 overflow-y-auto no-scrollbar p-5 pt-0`}
        >
            {/* Calender Header */}
            <CalenderHeader
                currentDate={currentDate}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
            />

            {/* Calendar*/}
            <div className="flex-1">
                <Calendar
                    currentDate={currentDate}
                    onDateClick={handleDateClick}
                    attendanceData={attendanceData}
                />
            </div>

            {/* Info modal */}
            {selectedAttendence && (
                <AttendenceInfoModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedAttendence={selectedAttendence}
                    children={undefined}
                />
            )}
        </div>
    );
}

export default Attendence;
