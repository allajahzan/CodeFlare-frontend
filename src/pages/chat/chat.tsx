import UserList from "@/components/common/user/user-list-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    EllipsisVertical,
    Image,
    Mic,
    Paperclip,
    Search,
    Smile,
    UserRoundPlus,
} from "lucide-react";
import profile from "@/assets/images/no-profile.svg";
import Picker from "@emoji-mart/react";
import { useContext, useEffect, useState } from "react";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { useNavigate } from "react-router-dom";

const users = [
    {
        id: 1,
        name: "Allaj",
        profilePic: "",
        lastMessage: "Hello",
        time: "10:00 AM",
    },
    {
        id: 2,
        name: "Jirjis",
        profilePic: "",
        lastMessage: "Goood morning!",
        time: "8:00 AM",
    },
];

// Chat page Component
function ChatPage() {
    // Emoji picker and data
    const [showPicker, setShowPicker] = useState(false);
    const [emojiData, setEmojiData] = useState<null | any>(null);

    // Message
    const [message, setMessage] = useState("");

    // Theme context
    const { theme } = useContext(ThemeContext) as IThemeContext;

    const naviagate = useNavigate();

    // Fetch apple emoji
    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json")
            .then((response) => response.json())
            .then((json) => setEmojiData(json));
    }, []);

    return (
        <div
            onClick={() => showPicker && setShowPicker(false)}
            className="h-full grid grid-cols-3 bg-background"
        >
            {/* Left side */}
            <div
                className="sticky top-0 h-[calc(100vh)] flex flex-col gap-5 p-0 pt-5 
            border-r border-border dark:border-customBorder shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Header */}
                <div className="flex items-center gap-2 px-5">
                    {/* Go back */}
                    <button onClick={() => naviagate(-1)} className="p-3">
                        <ArrowLeft className="w-4 h-4 text-foreground" />
                    </button>

                    <p className="flex-1 text-2xl text-foreground font-bold">Chats</p>

                    <button className="p-3 rounded-full hover:bg-muted dark:hover:bg-sidebar">
                        <EllipsisVertical className="w-4 h-4 text-foreground" />
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
                        <UserRoundPlus className="w-4 h-4 text-foreground" />
                    </button>
                </div>

                {/* lists */}
                <div className="h-full flex flex-col overflow-y-auto no-scrollbar border-t border-border dark:border-customBorder">
                    {users.map((user, index) => {
                        return (
                            <motion.div>
                                <UserList
                                    key={index}
                                    index={user.id}
                                    user={user as any}
                                    selectedUser={user}
                                    action={() => { }}
                                    className={cn(
                                        "flex-1 py-[9.4px] px-5 rounded-none border-x-0 border-y-0 bg-background dark:bg-transparent",
                                        index !== users.length - 1 ? "border-b-[1px]" : ""
                                    )}
                                    children1={
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {user.lastMessage}
                                        </p>
                                    }
                                    children2={
                                        <div className="w-[50px] flex flex-col justify-center items-end gap-1 ">
                                            <p className="w-full text-right text-xs text-foreground font-medium">
                                                {user.time}
                                            </p>
                                            <div className="bg-foreground w-5 h-5 flex items-center justify-center text-center rounded-full">
                                                <p className="text-xs text-background font-medium">3</p>
                                            </div>
                                        </div>
                                    }
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Right side */}
            <div
                className="relative h-[calc(100vh-108px) flex flex-col overflow-hidden col-span-2
            shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* User name card */}
                <div className="p-[16.8px] border-b">
                    <div className="flex items-center gap-3">
                        {/* Avatar profile pic */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => alert("hi")}
                            className="cursor-pointer"
                        >
                            <Avatar className="bg-background w-16 h-16 border-2">
                                {false && (
                                    <AvatarImage src={"allaj"} className="object-cover" />
                                )}
                                <AvatarFallback className="bg-transparent">
                                    <img src={profile} alt="" />
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
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
                                {/* <div className="bg-green-600 w-2 h-2 flex items-center justify-center text-center rounded-full"></div> */}
                                {"Online"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    style={{
                        backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png')`,
                    }}
                    className="relative flex-1 bg-muted dark:bg-sidebar"
                >
                    {/* Give shadow */}
                    <div className="absolue top-0 left-0 dark:bg-black/90 w-full h-full"></div>

                    {/* List of messages */}
                </div>

                {/* Input  box */}
                <div className="p-3 px-5 flex gap-2 items-center border-t">
                    <button
                        className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                    >
                        <Paperclip className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                        className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                    >
                        <Image className="w-4 h-4 text-foreground" />
                    </button>
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
                    <button
                        className="p-3 rounded-lg border hover:bg-muted dark:hover:bg-sidebar 
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                    >
                        <Mic className="w-4 h-4 text-foreground" />
                    </button>
                </div>

                {showPicker && (
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="absolute bottom-[66px] left-16 z-50 shadow-lg rounded-lg overflow-hidden"
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
        </div>
    );
}

export default ChatPage;
