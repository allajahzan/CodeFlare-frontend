import { MessageCircle } from "lucide-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NotSelected } from "@/components/animation/fallbacks";
import UsersListOfChat from "./chat-users-list";
import MessageSideOfChat from "./chat-message-side";
import { IUserChat } from "./user-contact-sheet";
import socket, {
    ListenForChats,
    listenForMessages,
    sendPrivateMessage,
} from "@/service/socket";
import { IUserContext, UserContext } from "@/context/user-context";
import { handleCustomError } from "@/utils/error";
import ApiEndpoints from "@/constants/api-endpoints";
import { fetchData } from "@/service/api-service";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

export interface Message {
    content: "text" | "image" | "file";
    status: "sent" | "seen" | "delivered" | "received";
    message: string;
    createdAt: String;
}

export interface Chat {
    chatId: string;
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

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Get chats from server
    useLayoutEffect(() => {
        const fetchChats = async () => {
            try {
                const resp = await fetchData(ApiEndpoints.CHAT, role);

                if (resp && resp.status === 200) {
                    const chat = resp.data.data;

                    if (chat) {
                        // Formatted user chats
                        const formattedUserChats: IUserChat[] = chat.map((chat: any) => {
                            return {
                                chatId: chat.chat._id,
                                _id:
                                    chat.sender._id === user?._id
                                        ? chat.receiver._id
                                        : chat.sender._id,
                                name:
                                    chat.sender._id === user?._id
                                        ? chat.receiver.name
                                        : chat.sender.name,
                                role:
                                    chat.sender._id === user?._id
                                        ? chat.receiver.role
                                        : chat.sender.role,
                                email:
                                    chat.sender._id === user?._id
                                        ? chat.receiver.email
                                        : chat.sender.email,
                                profilePic:
                                    chat.sender._id === user?._id
                                        ? chat.receiver.profilePic
                                        : chat.sender.profilePic,
                                content: "text",
                                lastMessage: chat.chat.lastMessage,
                                updatedAt: new Date(chat.chat.updatedAt).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    }
                                ),
                            };
                        });

                        // Update users
                        setUser(() => [...new Set(formattedUserChats)]);
                    }
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        fetchChats();
    }, []);

    // Get updated user chat from socket
    useEffect(() => {
        ListenForChats(user?._id as string, (chat) => {
            // Formatted user chat
            const formattedUserChat: IUserChat = {
                chatId: chat.chatId,
                _id:
                    chat.sender._id === user?._id ? chat.receiver._id : chat.sender._id,
                name:
                    chat.sender._id === user?._id ? chat.receiver.name : chat.sender.name,
                role:
                    chat.sender._id === user?._id ? chat.receiver.role : chat.sender.role,
                email:
                    chat.sender._id === user?._id
                        ? chat.receiver.email
                        : chat.sender.email,
                profilePic:
                    chat.sender._id === user?._id
                        ? chat.receiver.profilePic
                        : chat.sender.profilePic,
                content: "text",
                lastMessage: chat.lastMessage,
                updatedAt: new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };

            // Update users
            setUser((prevUsers: IUserChat[]) => {
                const filteredUserChats = prevUsers.filter(
                    (userChat) => userChat._id !== formattedUserChat._id
                );
                return [formattedUserChat, ...filteredUserChats];
            });
        });

        return () => {
            socket.off("chats");
        };
    }, [selectedUser]);

    // Listen for messages
    useEffect(() => {
        listenForMessages(user?._id as string, (message) => {
            console.log(message + "LISTENING MESSAGES");

            // Received message
            const newMessage: Message = {
                content: "text",
                status: "received",
                message: message.message,
                createdAt: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };

            // Update chat
            setSelectedChat((prevChat: Chat) => {
                if (prevChat.receiverId === message.senderId) {
                    return {
                        ...prevChat,
                        messages: [...prevChat.messages, newMessage],
                    };
                } else {
                    return prevChat;
                }
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

        // New Message
        const newMessage: Message = {
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
                    selectedUser={selectedUser}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    selectedChat={selectedChat as Chat}
                    setSelectedChat={setSelectedChat}
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
