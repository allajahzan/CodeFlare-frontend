import ApiEndpoints from "@/constants/apiEndpoints";
import { stateType } from "@/redux/store";
import { fetchData } from "@/service/apiService";
import { handleCustomError } from "@/utils/error";
import { createContext, ReactNode, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";

// Interface for User
interface IUser {
    name: string;
    email: string;
    phoneNo?: string;
    profilePic: string;
    role: string;
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

    // Get role
    const role = useSelector((state: stateType)=>state.role)

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

    const logout = () => {
        // Logout
        alert("logout");
    };

    return (
        <UserContext.Provider value={{ isAuth, setIsAuth, user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext };
