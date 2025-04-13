import { useEffect, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import Calendar, { IEvent } from "./calender";
import InfoModal from "./info-modal";
import CalenderHeader from "./header";

// Sample attendance data
const attendanceData: Record<string, any> = {
    "2025-03-25": {
        date: "2025-03-13",
        status: "absent",
        notes: "Sick leave",
        start: "2025-03-14T09:00",
        end: "05:30 pm",
    },
    "2025-03-26": {
        date: "2025-03-14",
        status: "present",
        notes: "On time",
        start: "09:000 am",
        end: "05:30 pm",
    },
    "2025-03-27": {
        date: "2025-03-15",
        status: "pending",
        notes: "Joined 30 minutes late",
        start: "09:000 am",
        end: "pending",
    },
};

// Attendence list Component
function AttendenceList() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Click on date
    useEffect(() => {
        if (selectedDate) {
            const dateStr = format(selectedDate as Date, "yyyy-MM-dd");
            setSelectedEvent(attendanceData[dateStr]);
        }
    }, [selectedDate]);

    // Clear event when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setSelectedEvent(null);
        }
    }, [isModalOpen]);

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
            {selectedEvent && (
                <InfoModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedEvent={selectedEvent}
                    children={undefined}
                />
            )}
        </div>
    );
}

export default AttendenceList;
