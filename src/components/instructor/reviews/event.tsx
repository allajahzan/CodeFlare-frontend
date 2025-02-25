// Interface for Props
interface PropsType {
    title: string;
    event: { title: string; start: string; end: string };
}

function EventComponent({event, title}: PropsType) {
    return (
        <div
            role="button"
            tabIndex={0}
            title={`${event.start} – ${event.end}: ${event.title}`}
            className="duration-0 flex flex-col gap-2"
        >
            {/* <div className="rbc-event-label">{`${event.start} – ${event.end}`}</div> */}
            <div className="">{'W 1'}</div>
            <div>B 1</div>
        </div>
    );
}

export default EventComponent;
