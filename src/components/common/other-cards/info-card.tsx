import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    label: string;
    text: string;
    iconDivClassName?: string;
    iconClassName?: string;
}

// Info card Component
function InfoCard({ Icon, label, text, iconDivClassName, iconClassName }: PropsType) {
    return (
        <div className="group min-w-[250px] p-3 rounded-lg border border-border bg-background shadow-sm">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", iconDivClassName)}>
                    <Icon className={cn("w-5 h-5 text-foreground",iconClassName)} />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <p className="text-foreground font-semibold">{text}</p>
                </div>
            </div>
        </div>
    );
}

export default InfoCard;
