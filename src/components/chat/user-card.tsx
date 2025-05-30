import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { cn } from "@/lib/utils";
import { ReactNode, useContext } from "react";
import { IUserChat } from "./user-contact-sheet";
import { Chat } from "./chat";
import { IUserContext, UserContext } from "@/context/user-context";
import { useMediaQuery } from "usehooks-ts";
import { userOnline } from "@/socket/communication/chat";

// Interface for Props
interface PropsType {
    users?: IUserChat[];
    user: IUserChat;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | {}>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setUsersListSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children1?: ReactNode;
    children2?: ReactNode;
    className?: string;
}

// User list card Component
function UserCard({
    users,
    user : userData,
    setSelectedUser,
    setSelectedChat,
    setIsOpen,
    setMessage,
    setUsersListSideOpen,
    children1,
    children2,
    className,
}: PropsType) {
    // Screen size
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Handle select user chat
    const handleSelectUserChat = (selectedUser: IUserChat) => {
        if (isSmall) {
            setUsersListSideOpen(false);
        }

        setIsOpen(false);

        // Check if receiver is in online
        userOnline(selectedUser._id);

        // Set user
        if (users) {
            setSelectedUser(() => {
                if (!selectedUser) return null;

                const matchedUser = (users as IUserChat[]).find(
                    (user) => user._id === selectedUser._id
                );

                return matchedUser
                    ? {
                        ...selectedUser,
                        chatId: matchedUser.chatId,
                        lastMessage: matchedUser.lastMessage,
                        updatedAt: matchedUser.updatedAt,
                    }
                    : selectedUser;
            });
        } else {
            setSelectedUser(selectedUser);
        }

        // Map chat
        const chat: Chat = {
            senderId: user?._id as string,
            receiverId: selectedUser._id as string,
            messages: [],
        };

        // Set chat
        setSelectedChat(() => {
            const userChat = users?.find(
                (userChat) => userChat._id === selectedUser._id
            );
            if (userChat) {
                return { ...userChat, messages: [] };
            } else {
                return chat;
            }
        });

        // Clear input box
        setMessage("");
    };

    return (
        <div
            onClick={() => handleSelectUserChat(userData)}
            className={cn(
                "px-5 dark:bg-transparent hover:bg-muted dark:hover:bg-sidebar cursor-pointer",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {/* Avatar profile pic */}
                <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                    <AvatarImage src={userData.profilePic} className="object-cover" />
                    <AvatarFallback className="bg-transparent">
                        <img className="w-full" src={profile} alt="" />
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 flex items-center justify-between gap-3 border-b-[1px]">
                    <div
                        className={cn(
                            "flex-1 py-4 min-w-[70px]"
                            // index !== users.length - 1 ? "" : ""
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground truncate">
                                {userData.name}
                            </p>
                        </div>
                        {children1}
                    </div>
                    {children2}
                </div>
            </div>
        </div>
    );
}

export default UserCard;
