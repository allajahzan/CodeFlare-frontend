import type React from "react";
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    View,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import CustomToolbar from "./toolbar";
import EventComponent from "./event";
import AddEventModal from "./modal-add-event";

const locales = {
    "en-US": import("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Calender Component
export default function Calendar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);

    const [currentView, setCurrentView] = useState<View>("month");

    // Example events
    const [events, setEvents] = useState([
        {
            title: "Product Review",
            start: new Date(2024, 1, 24, 10, 0),
            end: new Date(2024, 1, 24, 11, 0),
        },
    ]);

    const handleSelectSlot = (slotInfo: any) => {
        setSelectedSlot(slotInfo);
        setIsOpen(true);
    };

    return (
        <div className="h-[calc(100vh-108px)]">
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable={currentView !== "month"}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                onSelectSlot={handleSelectSlot}
                components={{
                    toolbar: CustomToolbar as any,
                    event: EventComponent as any,
                }}
                className="text-foreground border border-border"
            />

            {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-foreground">Schedule a Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleScheduleReview} className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm text-foreground font-medium"
                        >
                            Batch Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder="Enter batch's name"
                                required
                                autoComplete="off"
                                // {...register("name")}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <Calendar1 className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>

                    </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <div className="text-sm text-muted-foreground">
                                {selectedSlot &&
                                    format(selectedSlot.start, "MMMM d, yyyy h:mm a")}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Schedule Review</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog> */}
            <AddEventModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                events={events}
                setEvents={setEvents}
                selectedSlot={selectedSlot}
            />
        </div>
    );
}
