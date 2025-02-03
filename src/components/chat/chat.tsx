import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { NotSelected } from "@/components/animation/fallbacks";
import UsersListChat from "./chat-users-list";
import MessageSideChat from "./chat-message-side";

export interface Message {
    id: number;
    date: string;
    text: string;
    type: "text" | "image" | "file";
    status: "sent" | "recieved";
    read: boolean;
    time: string;
}

export interface Chat {
    id: number;
    sender: string;
    senderEmail: string;
    messages: Message[];
}

// Example messages
const u: Chat[] = [
    {
        id: 1,
        sender: "Allaj",
        senderEmail: "allaj@gmail.com",
        messages: [
            {
                id: 1,
                date: "20th Jun 2024",
                text: "How are you?",
                type: "text",
                status: "recieved",
                read: false,
                time: "10:00 AM",
            },
            {
                id: 2,
                date: "20th Jun 2024",
                text: "And where are you?",
                type: "text",
                status: "recieved",
                read: false,
                time: "10:00 AM",
            },
        ],
    },
    {
        id: 2,
        sender: "Jirjis",
        senderEmail: "jirjis@gmail.com",
        messages: [
            {
                id: 1,
                date: "20th Jun 2024",
                text: "Edaaa iyy ovde?",
                type: "text",
                status: "recieved",
                read: false,
                time: "10:00 AM",
            },
            {
                id: 2,
                date: "20th Jun 2024",
                text: "Therklaano?",
                type: "text",
                status: "recieved",
                read: false,
                time: "10:00 AM",
            },
        ],
    },
    {
        id: 3,
        sender: "Am",
        senderEmail: "am@gmail.com",
        messages: [
            {
                id: 2,
                date: "20th Jun 2024",
                text: "https://plus.unsplash.com/premium_photo-1673716788847-cd6420a6a8a9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVkJTIwZmxvd2VyfGVufDB8fDB8fHww",
                type: "image",
                status: "sent",
                read: false,
                time: "10:00 AM",
            },
        ],
    },
];

// Chat page Component
function Chat() {
    // Emoji picker
    const [showPicker, setShowPicker] = useState<boolean>(false);

    // Selected chat
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [users, setUser] = useState<Chat[] | null>([...u]);

    // Message
    const [message, setMessage] = useState("");

    // Handle send message
    const handleSendMessage = (
        text: string,
        type: "text" | "image" | "file",
        id: number
    ) => {
        let msg: Message = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            type: type,
            status: "sent",
            read: false,
            time: "21:34 pm",
        };

        setUser((prevUsers: Chat[] | null) => {
            if (!prevUsers) return prevUsers;

            return prevUsers.map((user) =>
                user.id === id ? { ...user, messages: [...user.messages, msg] } : user
            );
        });

        setSelectedChat((prevSelectedChat) => {
            if (!prevSelectedChat || prevSelectedChat.id !== id) {
                return users?.find((user) => user.id === id) as Chat;
            }
            return {
                ...prevSelectedChat,
                messages: [...prevSelectedChat.messages, msg],
            };
        });

        setMessage("");
    };

    return (
        <div
            onClick={() => showPicker && setShowPicker(false)}
            className="h-full grid grid-cols-3 bg-background"
        >
            {/* Left side */}
            <UsersListChat
                users={users as Chat[]}
                setSelectedChat={setSelectedChat}
                setMessage={setMessage}
            />

            {/* Right side */}
            {selectedChat && selectedChat.messages && (
                <MessageSideChat
                    users={users as Chat[]}
                    selectedChat={selectedChat}
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                />
            )}

            {/* If no chat is selected  */}
            {!selectedChat && (
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
