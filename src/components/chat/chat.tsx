import { MessageCircle } from "lucide-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NotSelected } from "@/components/animation/fallbacks";
import UsersListOfChat from "./chat-users-list";
import MessageSideOfChat from "./chat-message-side";
import { IUserChat } from "./user-contact-sheet";
import { socket } from "@/socket/communication/socket";
import {
    chatInfo,
    listenUserOnline,
    receivePrivateMessage,
    sendPrivateMessage,
} from "@/socket/communication/chat";
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
    senderId: string;
    receiverId: string;
    messages: Message[];
}

// Chat Component
function Chat() {
    // Emoji picker
    const [showPicker, setShowPicker] = useState<boolean>(false);

    // Chat related states
    const [selectedChat, setSelectedChat] = useState<Chat | {}>({});
    const [selectedUser, setSelectedUser] = useState<IUserChat | null>(null);
    const [users, setUser] = useState<IUserChat[] | []>([]);

    // Message
    const [message, setMessage] = useState("");

    // Slider
    const [isUsersListSideOpen, setUsersListSideOpen] = useState<boolean>(true);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Get user online status =================================================================================
    useEffect(() => {
        listenUserOnline((data) => {
            setSelectedUser((prevChat: IUserChat | null) => {
                if (prevChat && prevChat._id === data.receiverId) {
                    return { ...prevChat, isOnline: data.isOnline };
                } else {
                    return prevChat;
                }
            });
        });

        return () => {
            socket.off("userOnline");
        };
    }, []);

    // Get users chat from server ==============================================================================
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
                                chatId: chat._id,
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
                                content: chat.content,
                                lastMessage: chat.lastMessage,
                                updatedAt: new Date(chat.updatedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                }),
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

    // Get users-chatInfo from socket ===================================================================
    useEffect(() => {
        chatInfo(user?._id as string, (chat) => {
            // Update chatId
            setUser((prevUsers: IUserChat[]) => {
                return prevUsers.map((u) => {
                    if (u._id === chat.senderId || u._id === chat.receiverId) {
                        return {
                            ...u,
                            chatId: chat.chatId,
                        };
                    }
                    return u;
                });
            });

            // Update selected user chat with user details
            // setSelectedUser((prevUserChat) => {
            //     if (!prevUserChat) return null;

            //     if (prevUserChat._id === chat.senderId) {
            //         return {
            //             ...prevUserChat,
            //             name: chat.sender.name,
            //             email: chat.sender.email,
            //             profilePic: chat.sender.profilePic,
            //         };
            //     }

            //     return prevUserChat;
            // });
        });

        // Clean up
        return () => {
            socket.off("chatInfo");
        };
    }, [selectedUser]);

    // Listen new messages ============================================================================
    useEffect(() => {
        receivePrivateMessage(user?._id as string, async (message) => {
            // Received message
            const newMessage: Message = {
                content: message.content,
                status: "received",
                message: message.message,
                createdAt: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };

            // Update chat with received messages
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

            // ======================================================================

            // Formatted user chat
            const formattedUserChat: IUserChat = {
                chatId: "",
                _id: message.sender._id as string,
                name: message.sender.name as string,
                email: message.sender.email as string,
                role: message.sender.role as string,
                profilePic: message.sender.profilePic as string,
                content: message.content,
                lastMessage: message.message,
                updatedAt: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };

            // Update users with formatted user chat
            setUser((prevUsers: IUserChat[]) => {
                const filteredUserChats = prevUsers.filter(
                    (userChat) => userChat._id !== formattedUserChat._id
                );
                return [formattedUserChat, ...filteredUserChats];
            });
        });

        return () => {
            socket.off("receivePrivateMessage");
        };
    }, [selectedUser]);

    // Send new messages ==============================================================================
    const sendMessage = () => {
        // Send message to socket
        sendPrivateMessage(
            user?._id as string,
            selectedUser?._id as string,
            "text",
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

        // Update chat with new messages
        setSelectedChat((prevChat: Chat) => {
            return {
                ...prevChat,
                messages: [...prevChat.messages, newMessage],
            };
        });

        // Formatted user chat
        const formattedUserChat: IUserChat = {
            chatId: selectedUser?.chatId as string,
            _id: selectedUser?._id as string,
            name: selectedUser?.name as string,
            email: selectedUser?.email as string,
            role: selectedUser?.role as string,
            profilePic: selectedUser?.profilePic as string,
            content: "text",
            lastMessage: message,
            updatedAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        };

        // Update users with formatted user chat
        setUser((prevUsers: IUserChat[]) => {
            const filteredUserChats = prevUsers.filter(
                (userChat) => userChat._id !== formattedUserChat._id
            );
            return [formattedUserChat, ...filteredUserChats];
        });

        // Clear input box
        setMessage("");
    };

    // ====================================================================================================

    return (
        <div
            onClick={() => showPicker && setShowPicker(false)}
            className="h-full grid grid-cols-1 md:grid-cols-3 bg-background"
        >
            {/* Left side */}
            <UsersListOfChat
                users={users as IUserChat[]}
                selectedUser={selectedUser as IUserChat}
                setSelectedUser={setSelectedUser}
                setSelectedChat={setSelectedChat}
                setMessage={setMessage}
                isUsersListSideOpen={isUsersListSideOpen}
                setUsersListSideOpen={setUsersListSideOpen}
            />

            {/* Right side */}
            {selectedUser && (
                <MessageSideOfChat
                    setUser={setUser}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    selectedChat={selectedChat as Chat}
                    setSelectedChat={setSelectedChat}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                    setUsersListSideOpen={setUsersListSideOpen}
                />
            )}

            {/* If no chat is selected  */}
            {!selectedUser && (
                <div className="hidden md:flex flex-col items-center justify-center relative w-full min-h-screen col-span-2 bg-muted dark:bg-sidebar">
                    {/* <img className="w-80" src={chatImage} alt="" /> */}
                    <NotSelected
                        className="h-fixed rounded-none bg-transparent dark:bg-transparent border-none shadow-none"
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
