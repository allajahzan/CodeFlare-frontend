import ApiEndpoints from "@/constants/apiEndpoints";
import { toast } from "@/hooks/use-toast";
import { sideBarVisibilityAction, stateType } from "@/redux/store";
import { fetchData } from "@/service/apiService";
import axiosInstance from "@/service/axiosInstance";
import { handleCustomError } from "@/utils/error";
import { createContext, ReactNode, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Interface for User
interface IUser {
    name: string;
    email: string;
    phoneNo?: string;
    profilePic?: string;
    role: string;
    batch?: string;
    batches?: string[] | string;
    createdAt?: string;
    updatedAt?: string;
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

    const [isAuth, setIsAuth] = useState<boolean>(
        localStorage.getItem("isAuth") === "1"
    );

    const [user, setUser] = useState<IUser | null>(
        JSON.parse(localStorage.getItem("user") as string) || null
    );

    // Fetch user data
    useLayoutEffect(() => {
        const getUserData = async () => {
            try {
                const resp = await fetchData(ApiEndpoints.USER, role);

                const user = resp?.data.data;

                if (resp && resp.status === 200) {
                    localStorage.setItem("user", JSON.stringify(user));
                    setUser(user);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        isAuth ? getUserData() : null;
    }, [isAuth]); // Trigger effect when isAuth changes

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
