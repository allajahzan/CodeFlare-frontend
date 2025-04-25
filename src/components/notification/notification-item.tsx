import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    CircleXIcon,
    Info,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { animate, motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import IconButton from "../ui/icon-button";

interface User {
    name: string;
    image?: string;
}
// Define notification types
type NotificationType = "warning" | "review" | "info" | "success" | "fail";

export interface INotificationProps {
    id: string;
    type: NotificationType;
    message: string;
    time: string;
    image?: string;
    user?: User;
    path: string;
}

function NotificationItem({
    notification,
}: {
    notification: INotificationProps;
}) {
    const { type, message, time, image, user, path } = notification;

    // Define styles based on notification type
    const getTypeStyles = () => {
        switch (type) {
            case "warning":
                return {
                    containerClass:
                        "border-orange-400 bg-orange-50 dark:bg-orange-950/20",
                    icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
                };
            case "review":
                return {
                    containerClass: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
                    icon: <Calendar className="h-5 w-5 text-blue-500" />,
                };
            case "success":
                return {
                    containerClass: "border-green-400 bg-green-50 dark:bg-green-950/20",
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                };
            case "fail":
                return {
                    containerClass: "border-red-400 bg-red-50 dark:bg-red-950/20",
                    icon: <CircleXIcon className="h-5 w-5 text-red-500" />,
                };
            case "info":
            default:
                return {
                    containerClass: "border-gray-400 bg-gray-50 dark:bg-gray-800/20",
                    icon: <Info className="h-5 w-5 text-gray-500" />,
                };
        }
    };

    const { containerClass, icon } = getTypeStyles();

    const navigate = useNavigate();

    // Delete icon
    const [showDelete, setShowDelete] = useState(false);

    // Swipe
    const x = useMotionValue(0);

    const threshold = -60;

    // Handle drag end
    const handleDragEnd = () => {
        if (x.get() < threshold) {
            setShowDelete(true);
            animate(x, threshold, { type: "spring", stiffness: 300 });
        } else {
            setShowDelete(false);
            animate(x, 0, { type: "spring", stiffness: 300 });
        }
    };

    // Handle delete
    const handleDelete = () => {
        console.log("Delete notification with id:");
    };

    return (
        <div className="relative w-full">
            {/* Delete background layer */}
            {showDelete && (
                <div className="absolute inset-0 flex justify-end items-center rounded-md">
                    <IconButton
                        Icon={Trash2}
                        action={handleDelete}
                        className="bg-transparent rounded-full border-none"
                        iconClassName="text-red-600 w-5 h-5"
                    />
                </div>
            )}

            {/* Swipeable card */}
            <motion.div
                className={cn(
                    "relative z-20 p-4 rounded-md shadow-sm bg-white dark:bg-muted cursor-pointer",
                    containerClass
                )}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x }}
                onDragStart={() => setShowDelete(false)}
                onDragEnd={handleDragEnd}
                onDoubleClick={() => {
                    if (!showDelete) navigate(path);
                }}
            >
                {image && (
                    <div className="mb-3">
                        <img
                            src={image}
                            alt="Notification"
                            className="w-full h-auto rounded-md object-cover"
                        />
                    </div>
                )}

                <div className="flex items-start gap-3">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{message}</p>
                        <span className="text-xs text-muted-foreground mt-1">{time}</span>
                    </div>
                    {user && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={user.image || "/placeholder.svg"}
                                alt={user.name}
                            />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default NotificationItem;
