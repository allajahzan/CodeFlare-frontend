import { UserContext, IUserContext } from "@/context/userContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Interface for Props
interface PropType {
    allowedRole: string;
}

// Protected Route
function ProtectedRoutes({ allowedRole }: PropType) {
    const userContext = useContext(UserContext) as IUserContext;
    const { user, isAuth } = userContext;

    // Check auth and role
    if (!isAuth || allowedRole !== user?.role) {
        return <Navigate to={`/${allowedRole}/login`} />;
    }

    return <Outlet />;
}

// Export Protected Route
export default ProtectedRoutes;
