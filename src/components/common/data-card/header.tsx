// Interface for Props
interface PropsType {
    count: number;
    heading: string;
    children?: React.ReactNode;
}

// CardHeader Component
function CardHeader({ count, heading, children }: PropsType) {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex gap-2">
                <p className="text-lg text-foreground font-semibold">
                    {heading} {`(${count})`}
                </p>
            </div>
            {children}
        </div>
    );
}

export default CardHeader;
