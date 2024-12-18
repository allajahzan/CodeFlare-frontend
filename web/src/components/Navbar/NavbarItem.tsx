import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideProps } from "lucide-react";

interface propType {
    Image: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    action?: () => void;
    text: string;
}

function NavbarItem({ Image, action, text }: propType) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="">
                    <div onClick={action} className="flex items-center justify-center bg-zinc-100 rounded-full p-3">
                        <Image className="w-5 h-5" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default NavbarItem;
