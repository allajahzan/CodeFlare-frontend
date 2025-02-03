import { motion } from "framer-motion";
import {
    ArrowLeft,
    EllipsisVertical,
    Filter,
    MessageCirclePlusIcon,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Chat } from "./chat";
import UserList from "../common/user/user-list-card";

// Interface for Props
interface PropsType {
    users: Chat[];
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
}

// Users list Component
function UsersListChat({ users, setSelectedChat }: PropsType) {
    const navigate = useNavigate();
    return (
        <div
            className="sticky top-0 h-[calc(100vh)] flex flex-col gap-5 p-0 pt-5 
            border-r border-border shadow-sm dark:shadow-customBorder dark:shadow-inner"
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-5">
                {/* Go back */}
                <button onClick={() => navigate(-1)} className="p-3">
                    <ArrowLeft className="w-4 h-4 text-foreground" />
                </button>

                <p className="flex-1 text-2xl text-foreground font-bold">Chats</p>

                <button className="p-3 rounded-full hover:bg-muted dark:hover:bg-sidebar">
                    <MessageCirclePlusIcon className="w-5 h-5 text-foreground" />
                </button>

                <button className="p-3 rounded-full hover:bg-muted dark:hover:bg-sidebar">
                    <EllipsisVertical className="w-5 h-5 text-foreground" />
                </button>
            </div>

            {/* Search and add user */}
            <div className="flex items-center gap-2 px-5">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search"
                        autoComplete="off"
                        required
                        value={""}
                        onChange={() => { }}
                        className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                    />
                </div>

                {/* Add user */}
                <button
                    className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                >
                    <Filter className="w-4 h-4 text-foreground" />
                </button>
            </div>

            {/* lists */}
            <div className="h-full flex flex-col overflow-y-auto no-scrollbar border-t border-border">
                {users?.map((user, index) => {
                    return (
                        <motion.div key={index} onClick={() => setSelectedChat(user)}>
                            <UserList
                                index={index}
                                user={{ ...user, name: user.sender } as any}
                                selectedUser={user}
                                action={() => { }}
                                className={cn(
                                    "flex-1 py-[9.4px] px-5 rounded-none border-x-0 border-y-0 bg-background dark:bg-transparent",
                                    index !== users.length - 1 ? "border-b-[1px]" : ""
                                )}
                                children1={(() => {
                                    const lastMessage = user.messages?.[user.messages.length - 1]; // Get the last message
                                    return (
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {lastMessage && lastMessage.text}
                                        </p>
                                    );
                                })()}
                                children2={
                                    <div className="w-[50px] flex flex-col justify-center items-end gap-1 ">
                                        {/* Time or date */}
                                        <p className="w-full text-right text-xs text-foreground font-medium">
                                            {user.messages.length > 0 &&
                                                user.messages[user.messages.length - 1].time}
                                        </p>

                                        {/* Unread messages */}
                                        {(() => {
                                            let unreadMessage = user.messages?.filter(
                                                (msg) => msg.read === false && msg.type === "recieved"
                                            ).length;
                                            if (unreadMessage) {
                                                return (
                                                    <div className="bg-foreground w-5 h-5 flex items-center justify-center text-center rounded-full">
                                                        <p className="text-xs text-background font-medium">
                                                            {unreadMessage}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                }
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default UsersListChat;
