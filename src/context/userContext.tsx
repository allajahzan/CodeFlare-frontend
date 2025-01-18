import { adminApis } from "@/api/adminApi";
import { fetchData } from "@/utils/apiService";
import { handleError } from "@/utils/error";
import { createContext, ReactNode, useState, useLayoutEffect } from "react";

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
interface IUserContext {
    isAuth: boolean;
    user: IUser | null;
    logout: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);

// User Context Provider
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setAuth] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);

    useLayoutEffect(() => {
        const getAdmin = async () => {
            try {
                const resp = await fetchData(adminApis.admin);

                const data = resp?.data.data;

                if (resp && resp.status === 200) {
                    setUser(data.user);
                    setAuth(true);
                }
            } catch (err: any) {
                handleError(err);
            }
        };

        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) getAdmin();
    }, []);

    const logout = () => {
        alert("logout");
    };

    return (
        <UserContext.Provider value={{ isAuth, user, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
