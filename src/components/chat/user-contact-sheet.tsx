import { useLayoutEffect, useState } from "react";
import { Filter, Plus, Search, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "./chat";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { User } from "@/types/admin";
import { Student } from "@/types/coordinator";
import { Message } from "react-hook-form";
import UserListCard from "./user-list-card";

// Interface for Contact User
interface IContactUser {
    id: number;
    sender: string;
    senderEmail: string;
    role: string;
    profilePic: string;
    messages: Message[];
}

// Interface for Props
interface PropsType {
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
}

// User contact Sheet
function UserContactSheet({ setSelectedChat, isOpen, setIsOpen }: PropsType) {
    // Users
    const [users, setUsers] = useState<IContactUser[]>([]);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    useLayoutEffect(() => {
        const fetchUsers = async () => {
            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.GET_USERS, role);

                const users = resp?.data.data;

                // Success response
                if (resp && resp.status === 200) {
                    // Formate users
                    const formattedUsers = users.map(
                        (user: User | Student) => ({
                            _id: user._id,
                            sender: user.name,
                            senderEmail: user.email,
                            role: user.role,
                            profilePic: user.profilePic,
                            messages: [],
                        })
                    );

                    // Set users
                    setTimeout(() => {
                        // Set users
                        setUsers(formattedUsers);
                    }, 1000);
                }
            } catch (err: unknown) {
                setTimeout(() => {
                    handleCustomError(err);
                }, 1000);
            }
        };

        isOpen ? fetchUsers() : null;
    }, [isOpen]);

    return (
        <div
            className={cn(
                "h-full w-full bg-background absolute top-0 left-0 transition-all duration-300",
                isOpen ? "translate-x-0 opacity-1" : "-translate-x-full opacity-0"
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
                {users.map((user: IContactUser, index: number) => (
                    <UserListCard
                        key={index}
                        user={user}
                        setSelectedChat={setSelectedChat}
                        setIsOpen={setIsOpen}
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
