import { toast } from "@/hooks/use-toast";
import { receiveNotification } from "@/socket/communication/notification";
import { INotification } from "@/types/notification";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

// Interface for Notification Context
interface INotificationContext {
    notifications: INotification[];
    setNotifications: (value: INotification[]) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    addNotification: (notification: INotification) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

// Notification Context
const NotificationContext = createContext<INotificationContext | null>(null);

// Custom notification hook
const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error(
            "useNotification should be used within NotificationProvider"
        );
    return context;
};

// Notificaton Provider
const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(false);

    // Add notification
    const addNotification = (notification: INotification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    // Remove notification
    const removeNotification = (_id: string) => {
        setNotifications((prev) => prev.filter((n) => n._id !== _id));
    };

    // Clear notifications
    const clearNotifications = () => {
        setNotifications([]);
    };

    // Listen for warning messages
    useEffect(() => {
        receiveNotification((notification: INotification) => {
            // Add notification
            addNotification(notification);

            toast({ title: notification.message, description: "Warning" });
        });
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications,
                loading,
                setLoading,
                addNotification,
                removeNotification,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export { useNotification, NotificationProvider };
