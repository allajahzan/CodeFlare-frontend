import { Loader2, LucideProps } from "lucide-react";

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
        <div className="group relative flex items-center gap-3 p-3 h-[65.75px] bg-muted dark:bg-sidebar-backgroundDark rounded-lg overflow-hidden shadow-sm">
            {/* bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/20 dark:to-zinc-800/20 border border-zinc-200 dark:border-zinc-800 */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-zinc-200 dark:bg-zinc-700/20 rounded-bl-full opacity-50"></div>
            <div className="p-2 rounded-md lg:rounded-lg group-hover:border-white bg-zinc-400/20 group-hover:bg-zinc-400/30">
                <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-muted-foreground text-sm font-medium">{heading}</p>
                {fetching !== undefined ? (
                    fetching ? (
                        <Loader2 className="w-4 h-[21px] text-foreground animate-spin" />
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
