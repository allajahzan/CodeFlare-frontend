import { toast } from "@/hooks/use-toast";
import { fetchData } from "@/service/api-service";
import { receiveNotification } from "@/socket/communication/notification";
import { INotification } from "@/types/INotification";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { IUserContext, UserContext } from "./user-context";
import { stateType } from "@/redux/store";
import { useSelector } from "react-redux";
import ApiEndpoints from "@/constants/api-endpoints";
import { handleCustomError } from "@/utils/error";

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

    //  User context
    const { user, isAuth } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

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

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.NOTIFICATION + `?receiverId=${user?._id}&limit=0&skip=0`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    // Update notifications state
                    setTimeout(() => {
                        setNotifications(data);
                    }, 1000);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        isAuth && fetchNotifications();
    }, [isAuth]);

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
