import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    Image: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    action?: () => void;
    text: string;
}

// NavbarItem Component
function NavbarItem({ Image, action, text }: PropsType) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className={cn(
                        (text === "Community" || text === "Dark" || text === "Light") &&
                        "hidden sm:block"
                    )}
                >
                    <div
                        onClick={action}
                        className="flex items-center justify-center bg-muted rounded-full p-3"
                    >
                        <Image className="w-5 h-5 text-foreground" />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="text-foreground dark:bg-sidebar border borer-2">
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default NavbarItem;
