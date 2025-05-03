import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    className?: string;
    IconClassName?: string;
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    action?: () => void;
}

// Small Icon Button Component
function SmallIconButton({
    Icon,
    className,
    IconClassName,
    action,
}: PropsType) {
    return (
        <div
            onClick={action}
            className={cn("p-2 bg-muted rounded-full cursor-pointer", className)}
        >
            {Icon && (
                <Icon className={cn("w-4 h-4 text-foreground", IconClassName)} />
            )}
        </div>
    );
}

export default SmallIconButton;
