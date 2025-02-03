import { MessageCircle, UserRound } from "lucide-react";

import { useState } from "react";
import { NotFoundOrbit } from "@/components/animation/fallbacks";
import UsersListChat from "./chat-users-list";
import MessageSideChat from "./chat-message-side";

export interface Message {
    id: number;
    date: string;
    text: string;
    type: "sent" | "recieved"; // Use a union type for strict values
    read: boolean;
    time: string;
}

export interface Chat {
    id: number;
    sender: string;
    messages: Message[];
}

// Example messages
const u: Chat[] = [
    {
        id: 1,
        sender: "Allaj",
        messages: [
            {
                id: 1,
                date: "20th Jun 2024",
                text: "How are you?",
                type: "recieved",
                read: false,
                time: "10:00 AM",
            },
            {
                id: 2,
                date: "20th Jun 2024",
                text: "And where are you?",
                type: "recieved",
                read: false,
                time: "10:00 AM",
            },
        ],
    },
    {
        id: 2,
        sender: "Jirjis",
        messages: [
            {
                id: 1,
                date: "20th Jun 2024",
                text: "Edaaa iyy ovde?",
                type: "recieved",
                read: false,
                time: "10:00 AM",
            },
            {
                id: 2,
                date: "20th Jun 2024",
                text: "Therklaano?",
                type: "recieved",
                read: false,
                time: "10:00 AM",
            },
        ],
    },
    {
        id: 3,
        sender: "Am",
        messages: [],
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
    const handleSendMessage = (text: string, id: number) => {
        let msg: Message = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            type: "sent",
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
                <div className="relative w-full min-h-screen col-span-2 dark:bg-sidebar">
                    <NotFoundOrbit
                        className=" border-none bg-transparent dark:shadow-none rounded-none"
                        MainIcon={MessageCircle}
                        SubIcon={UserRound}
                        text="No chat selected"
                        message="Select a chat to start a conversation"
                    />
                </div>
            )}
        </div>
    );
}

export default Chat;
