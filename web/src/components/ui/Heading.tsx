import { cn } from "@/lib/utils";
import { stateType } from "@/redux/store";
import { useSelector } from "react-redux";

interface propType {
    text: string;
    className: string;
    handle?: () => void;
}

function Heading({ text, className, handle }: propType) {
    const isSmall = useSelector((state: stateType) => state.isSmall);
    return (
        <div
            onClick={isSmall ? handle : () => null}
            className={cn("flex items-center", isSmall ? "cursor-pointer" : "")}
        >
            <p className={className}>{text}</p>
        </div>
    );
}

export default Heading;
