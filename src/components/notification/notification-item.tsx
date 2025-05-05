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
import { useEffect, useState } from "react";
import IconButton from "../ui/icon-button";
import profile from "@/assets/images/no-profile.svg";
import { handleCustomError } from "@/utils/error";
import { formatDistanceToNow } from "date-fns";
import { INotification } from "@/types/INotification";

// Interface for Props
interface PropsType {
    notification: INotification;
    index: number;
    id: string;
}

// Notification Item Component
function NotificationItem({ notification, index, id }: PropsType) {
    const { type, message, path, sender, date } = notification;

    // Define styles based on notification type
    const getTypeStyles = () => {
        switch (type) {
            case "warning":
                return {
                    containerClass:
                        "bg-muted/80 hover:bg-muted dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark",
                    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
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

    // Time
    const [_timeNow, setTimeNow] = useState(new Date());

    // Delete icon
    const [showDelete, setShowDelete] = useState<boolean>(false);

    // Swipe
    const x = useMotionValue(0);

    const thresholdForDelete = -60;

    // Handle drag end
    const handleDragEnd = () => {
        if (x.get() < thresholdForDelete) {
            setShowDelete(true);
            animate(x, thresholdForDelete, { type: "spring", stiffness: 300 });
        } else {
            setShowDelete(false);
            animate(x, 0, { type: "spring", stiffness: 300 });
        }
    };

    // Handle delete
    const handleDelete = () => {
        try {
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

    // Update timeNow every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNow(new Date());
        }, 60 * 1000); // every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20}}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative w-full"
        >
            {/* Delete background layer */}
            {showDelete && (
                <div className="absolute inset-0 flex justify-end items-center rounded-md cursor-pointer">
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
                    "relative z-20 p-4 rounded-lg shadow-sm bg-white dark:bg-muted cursor-pointer",
                    containerClass
                )}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x }}
                onDragStart={() => setShowDelete(false)}
                onDragEnd={handleDragEnd}
                onDoubleClick={() => navigate(path)}
            >
                {/* {image && (
                    <div className="mb-3">
                        <img
                            src={image}
                            alt="Notification"
                            className="w-full h-auto rounded-md object-cover"
                        />
                    </div>
                )} */}

                <div className="flex items-start gap-3">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message}</p>
                        <span className="text-xs text-muted-foreground font-medium mt-1">
                            {formatDistanceToNow(new Date(date), { addSuffix: true })}
                        </span>
                    </div>
                    {sender && (
                        <Avatar className="bg-background w-10 h-10 border-2 border-background dark:border-border shadow-md">
                            <AvatarImage src={sender.profilePic} className="object-cover" />
                            <AvatarFallback className="bg-transparent">
                                <img src={profile} alt="" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default NotificationItem;
