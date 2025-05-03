import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    count?: number;
    heading: string;
    headingClassName?: string;
    children?: React.ReactNode;
}

// CardHeader Component
function CardHeader({ count, heading, headingClassName, children }: PropsType) {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex gap-2 min-w-0">
                <p className={cn("text-lg text-foreground font-semibold truncate", headingClassName)}>
                    {heading} {count !== undefined &&`(${count})`}
                </p>
            </div>
            {children}
        </div>
    );
}

export default CardHeader;
