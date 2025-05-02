import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// Interface for props
interface PropsType {
    title: string;
    subTitle: string;
    percentage: number;
    footer: string;
    subFooter: string;
}

// Radial chart Component
function RadialChart({ title, subTitle, percentage, footer, subFooter }: PropsType) {
    const [loaded, setLoaded] = useState(false);
    const CIRCUMFERENCE = 2 * Math.PI * 40;
    const dashOffset = loaded
        ? CIRCUMFERENCE * (1 - percentage / 100)
        : CIRCUMFERENCE;

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold mb-1 text-foreground">{title}</h2>
            <p className="text-gray-500 mb-8">{subTitle}</p>

            <div className="relative flex-1 w-full flex items-center justify-center mb-8">
                {/* Background circle */}
                {/* <div className="absolute w-full h-full rounded-full border-[20px] border-gray-100"></div> */}

                {/* Progress circle with SVG */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="20"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{
                            transition: "stroke-dashoffset 1.5s ease-in-out",
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="flex flex-col items-center justify-center z-10">
                    <span className="text-2xl font-bold">{percentage} %</span>
                    <span className="text-gray-500 text-sm font-medium">Completed</span>
                </div>
            </div>

            <div className="flex items-center text-base font-medium mb-2">
                {footer}
                <ArrowUpRight className="ml-1 h-5 w-5" />
            </div>
            <p className="text-gray-500">{subFooter}</p>
        </div>
    );
}

export default RadialChart;
