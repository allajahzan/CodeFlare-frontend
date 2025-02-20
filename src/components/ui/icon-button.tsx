import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface PropsType {
    className?: string;
    iconClassName?: string;
    action?: any;
    Icon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text?: string;
}
function IconButton({ className, action, Icon, iconClassName, text }: PropsType) {
    return (
        <button
            onClick={
                action
                    ? () => action()
                    : () => { }
            }
            className={cn(
                "p-3 rounded-lg border border-border hover:bg-muted dark:hover:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner",
                className
            )}
        >
            {Icon && <Icon className={cn("w-4 h-4 text-foreground", iconClassName)} />}
            {text && <p>{text}</p>}
        </button>
    );
}

export default IconButton;
