import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import image from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Chat } from "./chat";

// Interface for Props
interface PropsType {
    user: any;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children1?: ReactNode;
    children2?: ReactNode;
}

// User list card Component
function UserListCard({
    user,
    setSelectedChat,
    setIsOpen,
    children1,
    children2,
}: PropsType) {
    return (
        <div
            onClick={() => {
                setSelectedChat(user as any);
                setIsOpen(false);
            }}
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
                            {user.sender}
                        </p>
                    </div>
                    {children1}
                </div>
            </div>
            {children2}
        </div>
    );
}

export default UserListCard;
