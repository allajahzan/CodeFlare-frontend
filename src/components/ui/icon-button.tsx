import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface PropsType {
    text?: string;
    className: string;
    action?: any;
    Icon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
}
function IconButton({ className, text, action, Icon }: PropsType) {
    return (
        <button
            onClick={action}
            className={cn("text-sm font-semibold border shadow-md p-3", className)}
        >
            {text ? text : Icon && <Icon className="h-4 w-4" />}
        </button>
    );
}

export default IconButton;
