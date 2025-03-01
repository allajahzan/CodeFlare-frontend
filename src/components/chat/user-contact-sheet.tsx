import { useLayoutEffect, useState } from "react";
import { Filter, Plus, Search, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import UserCard from "./user-card";
import { Student } from "@/types/coordinator";
import { User } from "@/types/admin";
import { Chat } from "./chat";

// Interface for Contact User
export interface IUserChat {
    chatId: string;
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
    content: "text" | "image" | "file";
    lastMessage: string;
    updatedAt: string;
    isOnline?: boolean;
    count? : number;
}

// Interface for Props
interface PropsType {
    users: IUserChat[];
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | {}>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setUsersListSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
}

// User contact Sheet
function UserContactSheet({
    users: userChats,
    setSelectedUser,
    setSelectedChat,
    isOpen,
    setIsOpen,
    setMessage,
    setUsersListSideOpen,
}: PropsType) {
    // Users
    const [users, setUsers] = useState<IUserChat[]>([]);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Fetch users
    useLayoutEffect(() => {
        const fetchUsers = async () => {
            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.GET_USERS, role);

                const users = resp?.data.data;

                // Success response
                if (resp && resp.status === 200) {
                    // Formate users
                    const formattedUsers: IUserChat[] = users.map(
                        (user: Partial<User | Student>) => ({
                            chatId: "",
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            profilePic: user.profilePic,
                            content: "text",
                            lastMessage: "",
                            updatedAt: "",
                        })
                    );

                    // Set users
                    setUsers(formattedUsers);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        isOpen ? fetchUsers() : null;
    }, [isOpen]);

    return (
        <div
            className={cn(
                "h-full w-full bg-background absolute top-0 left-0 transition-all duration-300 ease-in-out",
                isOpen ? "translate-x-0 opacity-1" : "-translate-x-full opacity-1"
            )}
        >
            {/* Header */}
            <div className="py-5 pt-6 flex flex-col gap-5 bg-white dark:bg-transparent sticky top-0 border-b border-border">
                <div className="flex items-center gap-2 px-5">
                    <div className="p-2 bg-muted rounded-full">
                        <UsersRound className="w-4 h-4 text-foreground" />
                    </div>

                    <p className="flex-1 text-lg text-foreground font-bold">Contacts</p>

                    <div
                        onClick={() => setIsOpen(false)}
                        className="p-3 rounded-full hover:bg-muted"
                    >
                        <Plus className="w-4 h-4 rotate-45 text-foreground" />
                    </div>
                </div>

                {/* Search and add user */}
                <div className="flex items-center gap-2 px-5">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search-contact"
                            type="search"
                            placeholder="Search"
                            autoComplete="off"
                            required
                            value={""}
                            onChange={() => { }}
                            className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                        />
                    </div>

                    {/* Filter user */}
                    <IconButton Icon={Filter} />
                </div>
            </div>

            {/* Content */}
            <div className="p-0">
                {users.map((user: IUserChat, index: number) => (
                    <UserCard
                        key={index}
                        users={userChats}
                        user={user}
                        setSelectedUser={setSelectedUser}
                        setSelectedChat={setSelectedChat}
                        setMessage={setMessage}
                        setIsOpen={setIsOpen}
                        setUsersListSideOpen={setUsersListSideOpen}
                        children1={
                            <p className="text-sm text-muted-foreground font-medium">
                                {user.role[0].toUpperCase() + user.role.slice(1)}
                            </p>
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default UserContactSheet;
