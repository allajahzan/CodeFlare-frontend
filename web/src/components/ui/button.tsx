import { cn } from "@/lib/utils";

interface PropsType {
    text: string;
    className: string;
    action?: () => void;
}
function Button({ className, text, action }: PropsType) {
    return (
        <button
            onClick={action}
            className={cn(
                "px-6 py-2 text-sm font-semibold border shadow-md rounded-lg",
                className
            )}
        >
            {text}
        </button>
    );
}

export default Button;
