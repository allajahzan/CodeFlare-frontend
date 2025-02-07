import {
    ArrowLeft,
    Camera,
    EllipsisVertical,
    Filter,
    MessageCirclePlusIcon,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";
import UserContactSheet, { IUserChat } from "./user-contact-sheet";
import { Fragment, useState } from "react";
import UserCard from "./user-card";
import { Chat } from "./chat";

// Interface for Props
interface PropsType {
    users: IUserChat[];
    selectedUser: IUserChat;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | {}>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Users list Component
function UsersListOfChat({
    users,
    selectedUser,
    setSelectedUser,
    setSelectedChat,
    setMessage,
}: PropsType) {
    // Custom sheet states
    const [isOpen, setIsOpen] = useState<boolean>(false);

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

                {/* Contact */}
                <IconButton
                    Icon={MessageCirclePlusIcon}
                    action={() => setIsOpen(true)}
                    iconClassName="w-5 h-5"
                    className="border-none shadow-none rounded-full dark:shadow-none hover:bg-muted hover:dark:bg-sidebar"
                />

                {/* More */}
                <IconButton
                    Icon={EllipsisVertical}
                    iconClassName="w-5 h-5"
                    className="border-none shadow-none rounded-full dark:shadow-none hover:bg-muted hover:dark:bg-sidebar"
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
                        className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                    />
                </div>

                {/* Filter user */}
                <IconButton Icon={Filter} />
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
                            className={`${selectedUser?._id === user._id ? "bg-muted dark:bg-sidebar" : ""
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
                                        {user.updatedAt.toString()}
                                    </p>

                                    {/* Unread messages */}
                                    {(() => {
                                        return (
                                            <Fragment>
                                                <div className="h-5 w-5">
                                                    {/* <div className="bg-foreground w-5 h-5 flex items-center justify-center text-center rounded-full">
                                                      <p className="text-xs text-background font-medium">{}</p>
                                                    </div> */}
                                                </div>
                                            </Fragment>
                                        );
                                    })()}
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
                />
            </div>
        </div>
    );
}

export default UsersListOfChat;
