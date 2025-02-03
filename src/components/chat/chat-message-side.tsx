import UserProfileSheet from "./sheet-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import profile from "@/assets/images/no-profile.svg";
import Picker from "@emoji-mart/react";
import { useContext, useEffect, useRef, useState } from "react";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { Chat } from "./chat";
import TextCard from "./card-text";
import MediaCard from "./card-media";
import IconButton from "../ui/icon-button";

// Iterface for Props
interface PropsType {
    users: Chat[];
    selectedChat: Chat | null;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: (
        text: string,
        type: "text" | "image" | "file",
        id: number
    ) => void;
    showPicker: boolean;
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

// Messaege side Component
function MessageSideChat({
    users,
    selectedChat,
    message,
    setMessage,
    handleSendMessage,
    showPicker,
    setShowPicker,
}: PropsType) {
    // Emoji data
    const [emojiData, setEmojiData] = useState<null | any>(null);

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // Fetch apple emoji
    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json")
            .then((response) => response.json())
            .then((json) => setEmojiData(json));
    }, []);

    // Scroll down when sending a messgae
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
            className="relative h-screen flex flex-col overflow-hidden col-span-2
                  shadow-sm dark:shadow-customBorder dark:shadow-inner"
        >
            {/* User name card */}
            <div className="px-5 py-3 border-b sticky top-0 z-10 bg-background">
                <div className="flex items-center gap-3">
                    {/* Avatar profile pic as button for profile sheet */}
                    <UserProfileSheet
                        selectedUser={selectedChat as Chat}
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
                        {/* Name and role */}
                        <div className="flex items-center gap-2">
                            <p className="text-lg text-foreground font-semibold truncate">
                                {selectedChat?.sender}
                            </p>
                            <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                                {"Admin"}
                            </Badge>
                        </div>

                        {/* Status */}
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
                            selectedChat &&
                            selectedChat.messages.map((msg, index) => {
                                if (msg.type === "text") {
                                    if (msg.status === "recieved") {
                                        // For received messages
                                        return (
                                            <TextCard
                                                key={index}
                                                msg={msg}
                                                className="self-start bg-background dark:bg-muted"
                                            />
                                        );
                                    } else if (msg.status === "sent") {
                                        // For sent messages
                                        return (
                                            <TextCard
                                                key={index}
                                                msg={msg}
                                                className="self-end bg-[#d9fdd3] dark:bg-[#005c4b]"
                                            />
                                        );
                                    }
                                } else if (msg.type === "image") {
                                    if (msg.status === "recieved") {
                                        return (
                                            <MediaCard
                                                key={index}
                                                msg={msg}
                                                className="self-start bg-background dark:bg-muted"
                                            />
                                        );
                                    } else {
                                        return (
                                            <MediaCard
                                                key={index}
                                                msg={msg}
                                                className="self-end bg-[#d9fdd3] dark:bg-[#005c4b]"
                                            />
                                        );
                                    }
                                }
                            })}
                    </div>
                </div>
            </div>

            {/* Input box */}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (message) {
                        handleSendMessage(
                            message,
                            message ? "text" : "image",
                            selectedChat?.id as number
                        );
                    }
                }}
                className="p-5 px-5 flex gap-2 items-center border-t bg-background relative z-10"
            >
                {/* Pin */}
                <IconButton action={false} Icon={Paperclip} />

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
                <IconButton Icon={message ? Send : Mic} />
            </form>

            {/* Emoji picker */}
            {showPicker && (
                <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute bottom-24 left-[68px] z-50 shadow-md rounded-lg overflow-hidden"
                >
                    <Picker
                        data={emojiData}
                        onEmojiSelect={(emoji: any) => setMessage(message + emoji.native)}
                        theme={theme === "dark" ? "dark" : "light"}
                        set="apple"
                    />
                </div>
            )}
        </div>
    );
}

export default MessageSideChat;
