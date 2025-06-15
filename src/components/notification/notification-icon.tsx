import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "@/components/common/tooltip/tooltip";
import { Bell } from "lucide-react";
import NotFoundYet from "@/components/common/fallback/not-found-text";
import { INotification } from "@/types/INotification";
import CardHeader from "@/components/common/data-toolbar/header";
import NotificationItem from "./notification-item";

// Interface for Props
interface PropsType {
    notifications: INotification[];
}

// Notification Icon
function NotificationIcon({ notifications }: PropsType) {
    return (
        <DropdownMenu>
            <ToolTip
                text="Notifications"
                side="left"
                children={
                    <DropdownMenuTrigger
                        asChild
                        className="h-[44px] w-[44px] flex items-center justify-center rounded-full bg-muted cursor-pointer"
                    >
                        <div className="relative">
                            <Bell className="w-5 h-5 text-foreground" />
                            {/* Count */}
                            {notifications &&
                                notifications?.filter((item) => !item.isRead).length > 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        {/* Ping animation */}
                                        <span className="absolute h-5 w-5 rounded-full bg-red-800 opacity-75 animate-ping"></span>

                                        {/* Notification count */}
                                        <div className="relative flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-800 rounded-full">
                                            {notifications?.length}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </DropdownMenuTrigger>
                }
            />
            <DropdownMenuContent
                onMouseEnter={(e) => e.stopPropagation()}
                align="end"
                className="px-5 bg-transparent border-none shadow-none h-[448px] w-screen sm:w-[525px] overflow-hidden"
            >
                {/* You can map notifications here */}
                <div className="h-full w-full bg-background dark:bg-sidebar-background border rounded-lg shadow-md overflow-auto no-scrollbar">
                    <div className="sticky z-30 top-0 bg-background dark:bg-sidebar-background p-5 flex items-center justify-between">
                        <CardHeader heading="Notifications" />
                    </div>

                    {/* <div className="h-full"> */}
                        {notifications.length > 0 && (
                            <div className="px-5 pb-5 flex flex-col gap-3">
                                {notifications.map((notification, index) => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        index={index}
                                        id={notification._id}
                                    />
                                ))}
                            </div>
                        )}

                        {/* If no notifications */}
                        {notifications.length === 0 && (
                            <div className="h-full flex flex-col justify-center">
                                <NotFoundYet
                                    MainIcon={Bell}
                                    className="mb-24"
                                    text="No notifications"
                                />
                            </div>
                        )}
                    {/* </div> */}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NotificationIcon;
