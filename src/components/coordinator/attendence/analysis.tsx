import CardHeader from "@/components/common/data-card/header";

// Interface for Props
interface Propstype {
    view: "records-view" | "analysis-view";
    setView: React.Dispatch<
        React.SetStateAction<"records-view" | "analysis-view">
    >;
}

// Analysis Component
function Analysis({ view, setView }: Propstype) {
    return (
        <div className="p-5 pt-0 grid grid-cols-1">
            {/* Left side*/}
            <div
                className="sticky top-0 bg-background dark:bg-sidebar-background w-full p-5 flex flex-col gap-5
    h-[calc(100vh-108px)] mb-5 md:mb-0 rounded-2xl
    border border-border shadow-sm"
            >

                <CardHeader count={10} heading="Analysis" />

            </div>
        </div>
    );
}

export default Analysis;
