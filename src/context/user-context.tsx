import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { sideBarVisibilityAction, stateType } from "@/redux/store";
import { fetchData } from "@/service/api-service";
import axiosInstance from "@/service/axios-instance";
import { registerUser } from "@/socket/communication/chat";
import { handleCustomError } from "@/utils/error";
import {
    IBatch,
    IDomain,
    IRole,
    IStudentCategory,
    IWeek,
} from "@codeflare/common";
import {
    createContext,
    ReactNode,
    useState,
    useLayoutEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

// Interface for User
export interface IUser {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    profilePic: string;
    role: IRole;
    week?: IWeek;
    domain?: IDomain;
    batch?: IBatch;
    batches?: IBatch[];
    category?: IStudentCategory;
    lastActive?: string;
    createdAt?: string;
    isBlock?: string;
}

// Interface for User Context
export interface IUserContext {
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    logout: () => void;
}

// User Context
const UserContext = createContext<IUserContext | null>(null);

// User Context Provider Component
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    // Redux
    const role = useSelector((state: stateType) => state.role);
    const dispatch = useDispatch();

    // IsAuth state
    const [isAuth, setIsAuth] = useState<boolean>(
        localStorage.getItem("isAuth") === "1"
    );

    // User state - with error handler for undefined localstorage data
    const [user, setUser] = useState<IUser | null>(() => {
        try {
            return JSON.parse(localStorage.getItem("user") as string) || null;
        } catch (err: unknown) {
            return null;
        }
    });

    // Fetch user data
    useLayoutEffect(() => {
        const getUserData = async () => {
            try {
                const resp = await fetchData(ApiEndpoints.USER, role);

                const user = resp?.data.data;

                if (resp && resp.status === 200) {
                    localStorage.setItem("user", JSON.stringify(user));
                    setUser(user);

                    // Register a user to socket io
                    registerUser(user?._id as string);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        isAuth ? getUserData() : null;
    }, [isAuth]);

    // Logout user
    const logout = async () => {
        try {
            // Send request
            const resp = await axiosInstance.post(
                ApiEndpoints.LOGOUT,
                {},
                { withCredentials: false }
            );

            // Success response
            if (resp && resp.status === 200) {
                // Hide sidebar
                dispatch(sideBarVisibilityAction(false));

                toast({ title: "Successfully Logged out." });

                // Clear isAuth, user and localStorage
                setIsAuth(false);
                setUser(null);

                const theme = localStorage.getItem("theme");
                localStorage.clear();
                localStorage.setItem("theme", theme as string);
            }
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

    return (
        <UserContext.Provider value={{ isAuth, setIsAuth, user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext };
