interface PropsType {
    count: number;
    heading: string;
    children?: React.ReactNode;
}

function CardHeader({ count, heading, children }: PropsType) {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex gap-2">
                <p className="text-lg font-semibold">
                    {heading} {`(${count})`}
                </p>
            </div>
            {children}
        </div>
    );
}

export default CardHeader;
