import UserProfileSheet from "./user-profile-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import profile from "@/assets/images/no-profile.svg";
import Picker from "@emoji-mart/react";
import {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import TextCard from "./text-card";
import MediaCard from "./media-card";
import IconButton from "../ui/icon-button";
import { IUserChat } from "./user-contact-sheet";
import { Chat, Message } from "./chat";
import { IUserContext, UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";

// Iterface for Props
interface PropsType {
    selectedUser: IUserChat | null;
    selectedChat: Chat;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
    showPicker: boolean;
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

// Messaege side Component
function MessageSideOfChat({
    selectedUser,
    selectedChat,
    setSelectedChat,
    message,
    setMessage,
    sendMessage,
    showPicker,
    setShowPicker,
}: PropsType) {
    // Emoji data
    const [emojiData, setEmojiData] = useState<null | any>(null);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Fetch apple emoji
    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json")
            .then((response) => response.json())
            .then((json) => setEmojiData(json));
    }, []);

    // Fetch messages from server
    useLayoutEffect(() => {
        const fetchMessages = async () => {
            try {
                const resp = await fetchData(
                    ApiEndpoints.MESSAGE + `/${selectedChat.chatId}`,
                    role
                );

                if (resp && resp.status === 200) {
                    console.log(resp.data.data);

                    // Group all messages
                    const messages: Message[] = resp.data.data.map((msg: any) => ({
                        content: "text",
                        status: user?._id === msg.senderId ? "sent" : "received",
                        message: msg.message,
                        createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }),
                    }));

                    // Update chat with messages
                    setSelectedChat((prev) => ({
                        ...prev,
                        messages: messages,
                    }));
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        selectedChat.chatId ? fetchMessages() : null;

        return () => { };
    }, [selectedUser]);

    // Scroll down when sending a messgae
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            (messagesEndRef as any).current.scrollTop = (
                messagesEndRef as any
            ).current.scrollHeight;
        }
    }, [selectedChat]);

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
                        selectedUser={selectedUser as IUserChat}
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
                                {selectedUser?.name}
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
                        {selectedChat &&
                            selectedChat.messages.length > 0 &&
                            selectedChat.messages.map((msg, index) => {
                                if (msg.content === "text") {
                                    return (
                                        <TextCard
                                            key={index}
                                            msg={msg}
                                            className={cn(
                                                msg.status === "sent"
                                                    ? "self-end bg-[#d9fdd3] dark:bg-[#005c4b]"
                                                    : "self-start bg-background dark:bg-muted"
                                            )}
                                        />
                                    );
                                } else if (msg.content === "image") {
                                    return (
                                        <MediaCard
                                            key={index}
                                            msg={msg}
                                            className={cn(
                                                msg.status === "sent"
                                                    ? "self-end bg-[#d9fdd3] dark:bg-[#005c4b]"
                                                    : "self-start bg-background dark:bg-muted"
                                            )}
                                        />
                                    );
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
                        sendMessage();
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

export default MessageSideOfChat;
