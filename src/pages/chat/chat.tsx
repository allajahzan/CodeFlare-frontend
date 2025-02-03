import UserList from "@/components/common/user/user-list-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCheck,
    ChevronDown,
    EllipsisVertical,
    Filter,
    MessageCircle,
    MessageCirclePlusIcon,
    Mic,
    Paperclip,
    Search,
    Send,
    Smile,
    UserRound,
} from "lucide-react";
import profile from "@/assets/images/no-profile.svg";
import Picker from "@emoji-mart/react";
import { useContext, useEffect, useRef, useState } from "react";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { useNavigate } from "react-router-dom";
import UserProfileSheet from "./sheet-user-profile";
import { NotFoundOrbit } from "@/components/animation/fallbacks";

interface Message {
    id: number;
    date: string;
    text: string;
    type: "sent" | "recieved"; // Use a union type for strict values
    read: boolean;
    time: string;
}

interface Chat {
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
function ChatPage() {
    // Selected chat
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [users, setUser] = useState<Chat[] | null>([...u]);

    // Emoji picker and data
    const [showPicker, setShowPicker] = useState(false);
    const [emojiData, setEmojiData] = useState<null | any>(null);

    // Message
    const [message, setMessage] = useState("");

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    const naviagate = useNavigate();

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

    useEffect(() => {
        console.log(users);
    }, [users]);

    // Fetch apple emoji
    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json")
            .then((response) => response.json())
            .then((json) => setEmojiData(json));
    }, []);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            (messagesEndRef as any).current.scrollTop = (
                messagesEndRef as any
            ).current.scrollHeight;
        }
    }, [selectedChat?.messages?.length]);

    return (
        <div
            onClick={() => showPicker && setShowPicker(false)}
            className="h-full grid grid-cols-3 bg-background"
        >
            {/* Left side */}
            <div
                className="sticky top-0 h-[calc(100vh)] flex flex-col gap-5 p-0 pt-5 
            border-r border-border shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Header */}
                <div className="flex items-center gap-2 px-5">
                    {/* Go back */}
                    <button onClick={() => naviagate("login")} className="p-3">
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
                                        const lastMessage =
                                            user.messages?.[user.messages.length - 1]; // Get the last message
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

            {/* Right side */}
            {selectedChat && selectedChat.messages && (
                <div
                    className="relative h-screen flex flex-col overflow-hidden col-span-2
                  shadow-sm dark:shadow-customBorder dark:shadow-inner"
                >
                    {/* User name card */}
                    <div className="px-5 py-3 border-b sticky top-0 z-10 bg-background">
                        <div className="flex items-center gap-3">
                            {/* Avatar profile pic as button for profile sheet */}
                            <UserProfileSheet
                                button={
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="cursor-pointer"
                                    >
                                        <Avatar className="bg-background w-16 h-16 border-2">
                                            {false && (
                                                <AvatarImage src={"allaj"} className="object-cover" />
                                            )}
                                            <AvatarFallback className="bg-transparent">
                                                <img src={profile || "/placeholder.svg"} alt="" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </motion.div>
                                }
                            />
                            <div className="flex-1 flex flex-col justify-center gap-0 min-w-0 truncate">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-foreground font-semibold truncate">
                                        {"Allaj"}
                                    </p>
                                    <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                                        {"Admin"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium truncate tracking-wide flex items-center gap-2">
                                    {"Online"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-hidden">
                        <div
                            style={{
                                backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png')`,
                            }}
                            className="h-full w-full flex flex-col justify-end bg-[#eae6df] dark:bg-sidebar"
                        >
                            {/* Give shadow */}
                            <div className="w-full h-full absolute z-0 top-0 left-0 bg-white/10 dark:bg-black/90"></div>

                            {/* List of messages */}
                            <div
                                ref={messagesEndRef}
                                className="relative z-10 p-5 px-[68px] space-y-1 flex flex-col overflow-y-auto"
                            >
                                {users &&
                                    selectedChat.messages.map((msg, index) => {
                                        if (msg.type === "recieved") {
                                            // For received messages
                                            return (
                                                <div
                                                    key={index}
                                                    className="group self-start relative px-4 py-2 pr-14 shadow-md rounded-lg max-w-sm break-all 
                                                    bg-background dark:bg-muted"
                                                >
                                                    {/* Text */}
                                                    <p className="text-foreground font-medium">
                                                        {msg.text}
                                                    </p>

                                                    {/* Time */}
                                                    <small className="absolute right-2 bottom-0.5 text-[10px] text-muted-foreground font-semibold">
                                                        {msg.time}
                                                    </small>

                                                    {/* Options */}
                                                    <div
                                                        className="absolute top-0 right-0 h-full p-2 pt-1 group-hover:visible invisible rounded-r-lg
                                                    bg-transparent"
                                                    >
                                                        <ChevronDown className="w-4 h-4 text-foreground" />
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            // For sent messages
                                            return (
                                                <div
                                                    className="group self-end relative px-4 py-2 pr-[72px] shadow-md rounded-lg max-w-sm break-all 
                                                    bg-[#d9fdd3] dark:bg-[#005c4b]"
                                                >
                                                    {/* Text */}
                                                    <p className="text-foreground font-medium">
                                                        {msg.text}
                                                    </p>

                                                    {/* Time */}
                                                    <small className="absolute right-2 bottom-0.5 flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                                                        {msg.time}
                                                        <CheckCheck className="w-4 h-4 text-blue-400" />
                                                    </small>

                                                    {/* Options */}
                                                    <div
                                                        className="absolute top-0 right-0 h-full p-2 pt-1 group-hover:visible invisible rounded-r-lg
                                                    bg-transparent"
                                                    >
                                                        <ChevronDown className="w-4 h-4 text-foreground" />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* Input box */}
                    <div className="p-5 px-5 flex gap-2 items-center border-t bg-background relative z-10">
                        {/* Pin */}
                        <button
                            className="p-3 rounded-lg border border-border hover:bg-muted dark:hover:bg-sidebar 
                      shadow-sm dark:shadow-customBorder dark:shadow-inner"
                        >
                            <Paperclip className="w-4 h-4 text-foreground" />
                        </button>

                        {/* Input */}
                        <div className="relative flex-1 flex items-center">
                            <Smile
                                onClick={() => setShowPicker(!showPicker)}
                                className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground cursor-pointer"
                            />
                            <Input
                                type="text"
                                placeholder="Type a message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                className="p-5 pl-9 text-foreground font-medium rounded-lg dark:shadow-customBorder dark:shadow-inner"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={
                                message
                                    ? () => {
                                        handleSendMessage(message, selectedChat.id);
                                    }
                                    : () => { }
                            }
                            className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                      shadow-sm dark:shadow-customBorder dark:shadow-inner"
                        >
                            {message && <Send className="w-4 h-4 text-foreground" />}
                            {!message && <Mic className="w-4 h-4 text-foreground" />}
                        </button>
                    </div>

                    {/* Emoji picker */}
                    {showPicker && (
                        <div
                            onClick={(event) => event.stopPropagation()}
                            className="absolute bottom-24 left-[68px] z-50 shadow-md rounded-lg overflow-hidden"
                        >
                            <Picker
                                data={emojiData}
                                onEmojiSelect={(emoji: any) =>
                                    setMessage(message + emoji.native)
                                }
                                theme={theme === "dark" ? "dark" : "light"}
                                set="apple"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* If not chats are selected  */}
            {!selectedChat && (
                <div className="relative w-full min-h-screen col-span-2 dark:bg-sidebar">
                    {/* Give shadow */}
                    <div className="w-full h-full absolute z-0 top-0 left-0 bg-white/10 dark:bg-black/90"></div>

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

export default ChatPage;
