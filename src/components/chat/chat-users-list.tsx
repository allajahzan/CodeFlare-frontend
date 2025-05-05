import {
    Camera,
    ChevronLeft,
    EllipsisVertical,
    Filter,
    MessageCirclePlusIcon,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";
import UserContactSheet, { IUserChat } from "./user-contact-sheet";
import { useState } from "react";
import UserCard from "./user-card";
import { Chat } from "./chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getRelativeTime } from "@/utils/relative-time";

// Interface for Props
interface PropsType {
    users: IUserChat[];
    selectedUser: IUserChat;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | {}>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    isUsersListSideOpen: boolean;
    setUsersListSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Users list Component
function UsersListOfChat({
    users,
    selectedUser,
    setSelectedUser,
    setSelectedChat,
    setMessage,
    isUsersListSideOpen,
    setUsersListSideOpen,
}: PropsType) {
    // Custom sheet states
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "sticky top-0 z-50 h-[calc(100vh)] flex flex-col gap-5 p-0 bg-background dark:bg-sidebar-background",
                "border-r border-border shadow-s transition-all duration-0",
                isUsersListSideOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Header */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 px-5 py-5">
                    {/* Go back */}
                    <button onClick={() => navigate("dashboard")} className="p-2">
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>

                    <motion.p
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 text-2xl text-foreground font-bold"
                    >
                        Chats
                    </motion.p>

                    {/* Contact */}
                    <IconButton
                        Icon={MessageCirclePlusIcon}
                        action={() => setIsOpen(true)}
                        iconClassName="w-5 h-5"
                        className="cursor-pointer border-none shadow-none rounded-full dark:shadow-none bg-background dark:bg-transparent dark:hover:bg-muted"
                    />

                    {/* More */}
                    <IconButton
                        Icon={EllipsisVertical}
                        iconClassName="w-5 h-5"
                        className="cursor-pointer border-none shadow-none rounded-full dark:shadow-none bg-background dark:bg-transparent dark:hover:bg-muted"
                    />
                </div>

                {/* Search and add user */}
                <div className="flex items-center gap-2 px-5">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search-chat"
                            type="search"
                            placeholder="Search"
                            autoComplete="off"
                            required
                            value={""}
                            onChange={() => { }}
                            className="p-5 pl-9 text-foreground font-medium rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Filter user */}
                    <IconButton
                        Icon={Filter}
                        className="bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
                    />
                </div>
            </div>

            {/* lists */}
            <div className="h-full flex flex-col overflow-y-auto no-scrollbar border-t border-border">
                {users?.map((user, index) => {
                    return (
                        <UserCard
                            key={index}
                            user={{ ...user, name: user.name } as any}
                            setSelectedUser={setSelectedUser}
                            setSelectedChat={setSelectedChat}
                            setMessage={setMessage}
                            setIsOpen={setIsOpen}
                            setUsersListSideOpen={setUsersListSideOpen}
                            className={`cursor-pointer ${selectedUser?._id === user._id ? "bg-muted dark:bg-sidebar" : ""
                                }`}
                            children1={(() => {
                                const lastMessage = user.lastMessage; // Get the last message
                                if (lastMessage) {
                                    if (user.content === "text") {
                                        return (
                                            <p className="text-sm text-muted-foreground font-medium truncate">
                                                {lastMessage}
                                            </p>
                                        );
                                    } else if (user.content === "image") {
                                        return (
                                            <div className="flex items-center gap-1">
                                                <Camera className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    Photo
                                                </p>
                                            </div>
                                        );
                                    }
                                }
                            })()}
                            children2={
                                <div className="w-[60px] flex flex-col justify-center items-end gap-1">
                                    {/* Time or date */}
                                    <p className="w-full text-end text-xs text-foreground font-medium">
                                        {getRelativeTime(user.updatedAt)}
                                    </p>

                                    <div className="w-5 h-5" />
                                </div>
                            }
                        />
                    );
                })}

                {/* Custom sheet for contacts */}
                <UserContactSheet
                    users={users}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setSelectedUser={setSelectedUser}
                    setSelectedChat={setSelectedChat}
                    setMessage={setMessage}
                    setUsersListSideOpen={setUsersListSideOpen}
                />
            </div>
        </div>
    );
}

export default UsersListOfChat;
