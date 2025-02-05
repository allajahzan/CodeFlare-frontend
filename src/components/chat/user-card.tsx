import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import image from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { cn } from "@/lib/utils";
import { ReactNode, useContext } from "react";
import { IUserChat } from "./user-contact-sheet";
import { Chat } from "./chat";
import { IUserContext, UserContext } from "@/context/user-context";

// Interface for Props
interface PropsType {
    user: IUserChat;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | {}>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    children1?: ReactNode;
    children2?: ReactNode;
}

// User list card Component
function UserCard({
    user,
    setSelectedUser,
    setSelectedChat,
    setIsOpen,
    setMessage,
    children1,
    children2,
}: PropsType) {
    const { user: sender } = useContext(UserContext) as IUserContext;

    // Handle select chat
    const handleSelectChat = (selectedUser: IUserChat) => {
        // Close the sheet
        setIsOpen(false);

        // Set user
        setSelectedUser(user as IUserChat);

        // Map chat
        const chat: Chat = {
            senderId: sender?._id as string,
            receiverId: selectedUser._id as string,
            messages: [],
        };

        // Set chat
        setSelectedChat((prevChat: Chat) => {
            if (
                prevChat.senderId === chat.senderId &&
                prevChat.receiverId === chat.receiverId
            ) {
                return prevChat;
            } else {
                return chat;
            }
        });

        // Clear input box
        setMessage("");
    };

    return (
        <div
            onClick={() => handleSelectChat(user)}
            className="flex-1 pl-5 dark:bg-transparent hover:bg-muted dark:hover:bg-sidebar"
        >
            <div className="flex items-center gap-3">
                {/* Avatar profile pic */}
                <Avatar className="bg-background w-12 h-12 border-2">
                    {user.profilePic && (
                        <AvatarImage src={image} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-transparent">
                        <img className="w-full" src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>

                <div
                    className={cn(
                        "flex-1 min-w-0 py-4 border-b-[1px]"
                        // index !== users.length - 1 ? "" : ""
                    )}
                >
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">
                            {user.name}
                        </p>
                    </div>
                    {children1}
                </div>
            </div>
            {children2}
        </div>
    );
}

export default UserCard;
