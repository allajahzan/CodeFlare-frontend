import Users from "@/components/admin/users/users";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Users Component
function UsersPage({ isDrawerOpen, setDrawerOpen }: PropsType) {
    return <Users isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />;
}

export default UsersPage;
