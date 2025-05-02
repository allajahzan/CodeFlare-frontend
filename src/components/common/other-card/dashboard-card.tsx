import CardHeader from "@/components/common/data-toolbar/header";

// Interface for Props
interface PropsType { }

// Dashboard card Component
function DashboardCard() {
    return (
        <div className="w-full h-[400px] p-5 bg-background dark:bg-sidebar-background border border-border rounded-2xl shadow-sm">
            <CardHeader heading="Overall Information" />

            
        </div>
    );
}

export default DashboardCard;
