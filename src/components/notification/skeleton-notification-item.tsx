import { Skeleton } from "../ui/skeleton";

// Notification skeleton Component
function NotificationSkeloton() {
    return (
        <div className="relative z-20 p-4 rounded-md cursor-pointer">
            <div className="flex items-start gap-3">
                {/* Icon Skeleton */}
                <Skeleton className="w-10 h-10 rounded-full bg-muted dark:bg-sidebar-backgroundDark" />
                <div className="flex-1">
                    {/* Message Title Skeleton */}
                    <Skeleton className="h-4 w-[80%] bg-muted dark:bg-sidebar-backgroundDark" />
                    {/* Time Skeleton */}
                    <Skeleton className="h-3 w-[60%] bg-muted dark:bg-sidebar-backgroundDark mt-1" />
                </div>
                {/* Avatar Skeleton */}
                <Skeleton className="w-10 h-10 rounded-full bg-muted dark:bg-sidebar-backgroundDark" />
            </div>
        </div>
    );
}

export default NotificationSkeloton;
