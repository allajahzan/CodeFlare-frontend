import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    count: number;
    heading: string;
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    fetching?: boolean | undefined;
}

// Count card Component
function CountCard({ count, heading, Icon, fetching }: PropsType) {
    return (
        <div className="group relative flex items-center gap-3 p-3 h-[65.75px] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden shadow-sm">
            {/* bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/20 dark:to-zinc-800/20 border border-zinc-200 dark:border-zinc-800 */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-700/20 rounded-bl-full opacity-50"></div>
            <div className="p-2 rounded-md lg:rounded-lg group-hover:border-white bg-purple-400/20 group-hover:bg-purple-400/30">
                <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-muted-foreground text-sm font-medium">{heading}</p>
                {fetching !== undefined ? (
                    fetching ? (
                        <p className="text-foreground font-bold animate-pulse">...</p>
                    ) : (
                        <p className="text-foreground font-bold">{count}</p>
                    )
                ) : (
                    <p className="text-foreground font-bold">{count}</p>
                )}
            </div>
        </div>
    );
}

export default CountCard;
