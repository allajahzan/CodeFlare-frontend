import { MessageCircle } from "lucide-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NotSelected } from "@/components/animation/fallbacks";
import UsersListOfChat from "./chat-users-list";
import MessageSideOfChat from "./chat-message-side";
import { IUserChat } from "./user-contact-sheet";
import socket, {
    listenForMessages,
    registerUser,
    sendPrivateMessage,
} from "@/service/socket";
import { IUserContext, UserContext } from "@/context/user-context";

export interface Message {
    type: "private" | "group";
    content: "text" | "image" | "file";
    status: "sent" | "seen" | "delivered" | "recieved";
    message: string;
    createdAt: String;
}

export interface Chat {
    senderId: string;
    receiverId: string;
    messages: Message[];
}

// Chat page Component
function Chat() {
    // Emoji picker
    const [showPicker, setShowPicker] = useState<boolean>(false);

    // Chat related states
    const [selectedChat, setSelectedChat] = useState<Chat | {}>({});
    const [selectedUser, setSelectedUser] = useState<IUserChat | null>(null);
    const [users, setUser] = useState<IUserChat[] | []>([]);

    // Message
    const [message, setMessage] = useState("");

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Register a user
    useLayoutEffect(() => {
        registerUser(user?._id as string);
    }, []);

    // Listen to messages
    useEffect(() => {
        listenForMessages(user?._id as string, (message) => {
            // received message
            const newMessage: Message = {
                type: "private",
                content: "text",
                status: "recieved",
                message: message.message,
                createdAt: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };

            // Update chat
            setSelectedChat((prevChat: Chat) => {
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, newMessage],
                };
            });
        });

        return () => {
            socket.off("receivePrivateMessage");
        };
    }, []);

    // Send private messages
    const sendMessage = () => {
        // Send message to socket
        sendPrivateMessage(
            user?._id as string,
            selectedUser?._id as string,
            message
        );

        // new Message
        const newMessage: Message = {
            type: "private",
            content: "text",
            status: "sent",
            message: message,
            createdAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        };

        // Update chat
        setSelectedChat((prevChat: Chat) => {
            return {
                ...prevChat,
                messages: [...prevChat.messages, newMessage],
            };
        });

        // Clear input box
        setMessage("");
    };

    useEffect(() => {
        console.log(selectedChat);
    }, [selectedChat]);

    return (
        <div
            onClick={() => showPicker && setShowPicker(false)}
            className="h-full grid grid-cols-3 bg-background"
        >
            {/* Left side */}
            <UsersListOfChat
                users={users as IUserChat[]}
                setSelectedUser={setSelectedUser}
                setSelectedChat={setSelectedChat}
                setMessage={setMessage}
            />

            {/* Right side */}
            {selectedUser && (
                <MessageSideOfChat
                    users={users as IUserChat[]}
                    selectedUser={selectedUser}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    selectedChat={selectedChat as Chat}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                />
            )}

            {/* If no chat is selected  */}
            {!selectedUser && (
                <div className="relative w-full min-h-screen col-span-2 bg-muted dark:bg-sidebar">
                    <NotSelected
                        className="h-full rounded-none bg-transparent border-none"
                        MainIcon={MessageCircle}
                        IconClassName="w-5 h-5 text-foreground"
                        text="No chat selected"
                        message="Select a chat to start messaging"
                    />
                </div>
            )}
        </div>
    );
}

export default Chat;
