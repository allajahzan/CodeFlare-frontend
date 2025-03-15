import { useEffect, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { CalendarHeader } from "./header";
import Calendar, { IEvent } from "./calender";
import InfoModal from "./info-modal";

// Sample attendance data
const attendanceData: Record<string, any> = {
    "2025-03-13": { date: '2025-03-13', status: "absent", notes: "Sick leave", start: '2025-03-14T09:00', end: '05:30 pm' },
    "2025-03-14": { date: '2025-03-14', status: "present", notes: "On time", start: '09:000 am', end: '05:30 pm'  },
    "2025-03-15": { date: '2025-03-15', status: "pending", notes: "Joined 30 minutes late", start: '09:000 am', end: 'pending'  },
};

// Attendence list Component
function AttendenceList() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePreviousMonth = () => {
        setCurrentDate((prev) => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => addMonths(prev, 1));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (selectedDate) {
            const dateStr = format(selectedDate as Date, "yyyy-MM-dd");
            setSelectedEvent(attendanceData[dateStr]);
        }
    }, [selectedDate]);

    return (
        <div className="p-5 pt-0 overflow-hidden">
            <main className="h-[calc(100vh-108px)] bg-background dark:bg-sidebar-background flex flex-col p-0 rounded-2xl border overflow-hidden">
                <CalendarHeader
                    currentDate={currentDate}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                />
                {/* Make Calendar Take Remaining Space */}
                <div className="flex-1 overflow-hidden">
                    <Calendar
                        currentDate={currentDate}
                        onDateClick={handleDateClick}
                        attendanceData={attendanceData}
                    />
                </div>
            </main>

            {/* Info modal */}
            {selectedEvent && <InfoModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedEvent={selectedEvent}
            />}
        </div>
    );
}

export default AttendenceList;
