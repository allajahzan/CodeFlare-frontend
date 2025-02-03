import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface PropsType {
    className?: string;
    iconClassName?: string;
    action?: any;
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
}
function IconButton({ className, action, Icon, iconClassName }: PropsType) {
    return (
        <button
            onClick={
                action
                    ? () => {
                        alert("yes");
                    }
                    : () => { }
            }
            className={cn(
                "p-3 rounded-lg border border-border hover:bg-muted dark:hover:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner",
                className
            )}
        >
            <Icon className={cn("w-4 h-4 text-foreground", iconClassName)} />
        </button>
    );
}

export default IconButton;
