import { adminApis } from "@/api/adminApi";
import { fetchData } from "@/utils/apiService";
import { handleError } from "@/utils/error";
import { createContext, ReactNode, useState, useLayoutEffect } from "react";

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
interface IUserContext {
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    logout: () => void;
}

// User Context
const UserContext = createContext<IUserContext | null>(null);

// User Context Provider Component
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(
        localStorage.getItem("isAuth") === "1"
    );
    const [user, setUser] = useState<IUser | null>(null);

    // Fetch user data
    useLayoutEffect(() => {
        const getUserData = async () => {
            try {
                const resp = await fetchData(adminApis.admin);

                const data = resp?.data.data;

                if (resp && resp.status === 200) {
                    setUser(data.user);
                }
            } catch (err: any) {
                handleError(err);
            }
        };

        if (isAuth) getUserData();
    }, [isAuth]); // Trigger effect when isAuth changes

    const logout = () => {
        // Logout
        alert("logout");
    };

    return (
        <UserContext.Provider value={{ isAuth, setIsAuth, user, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Export User Context
export { UserContextProvider, UserContext };
