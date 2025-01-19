import { IUserContext, UserContext } from "@/context/userContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Inteface for Props
interface PropsType {
    allowedRole: string;
}

// UnProtected Route
function PublicRoute({ allowedRole }: PropsType) {
    const userContext = useContext(UserContext) as IUserContext;
    const { isAuth, user } = userContext;

    // Check auth and role
    if (isAuth && user?.role === allowedRole) {
        return <Navigate to={`/${allowedRole}/dashboard`} />;
    }

    return <Outlet />;
}

// Export UnProtected Route
export default PublicRoute;
