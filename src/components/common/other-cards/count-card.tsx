// Interface for Props
interface PropsType {
    count: number;
    heading: string;
}

// CountCard Component
function CountCard({ count, heading }: PropsType) {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm">
            <div className="p-2 w-[40px] rounded-lg bg-muted">
                <p className="text-foreground text-center font-bold">{count}</p>
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-foreground">{heading}</p>
            </div>
        </div>
    );
}

export default CountCard;
