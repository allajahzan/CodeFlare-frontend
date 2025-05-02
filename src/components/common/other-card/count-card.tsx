import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    count: number;
    heading: string;
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

// Count card Component
function CountCard({ count, heading, Icon }: PropsType) {
    return (
        <div
            className="group flex items-center gap-3 p-2 lg:p-3 border border-transparent dark:border-border bg-muted dark:bg-sidebar rounded-lg 
        shadow-smr"
        >
            <div className="p-2 rounded-md lg:rounded-lg group-hover:border-white bg-blue-400/20 group-hover:bg-blue-400/30">
                <Icon className="w-5 h-5 text-blue-600"/>
            </div>
            <div className="flex flex-col items-start">
            
                <p className="hidden lg:block text-foreground text-sm font-medium">{heading}</p>
                <p className="text-foreground font-bold">{count}</p>
            </div>
        </div>
    );
}

export default CountCard;
