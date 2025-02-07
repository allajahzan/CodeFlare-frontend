import { Camera, File, Image, MapPin, Paperclip } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { IUserChat } from "./user-contact-sheet";
import { Chat, Message } from "./chat";

// Interface for Props
interface PropsType {
    setUser: React.Dispatch<React.SetStateAction<[] | IUserChat[]>>;
    selectedUser: IUserChat | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<IUserChat | null>>;
    selectedChat: Chat;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat>>;
}

// Paper clip Component
function PaperClip({
    setUser,
    selectedUser,
    setSelectedUser,
    selectedChat,
    setSelectedChat,
}: PropsType) {
    // Image
    const [image, setImage] = useState<string>("");

    // Open gallery
    const openGallery = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg, image/jpg";
        input.multiple = true;
        input.style.display = "none";

        input.addEventListener("change", (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
                // Convert to base 64 format
                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = () => {
                    const imageUrl = reader.result as string;
                    setImage(imageUrl); // Update image state

                    // Formatted message for image
                    const message: Message = {
                        content: "image",
                        status: "sent",
                        message: imageUrl,
                        createdAt: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }),
                    };

                    // Update chat messages
                    setSelectedChat((prevChat) => ({
                        ...prevChat,
                        messages: [...prevChat.messages, message],
                    }));

                    // Formatted user chat
                    const formattedUserChat: IUserChat = {
                        chatId: selectedUser?.chatId as string,
                        _id: selectedUser?._id as string,
                        name: selectedUser?.name as string,
                        email: selectedUser?.email as string,
                        role: selectedUser?.role as string,
                        profilePic: selectedUser?.profilePic as string,
                        content: "image",
                        lastMessage: "image",
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

                    setImage("");
                };
                reader.onerror = (err) => {
                    console.log(err);
                };
            }
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="p-3 rounded-lg border border-border hover:bg-muted dark:hover:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner">
                    <Paperclip className="h-4 w-4 text-foreground" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-600/20">
                            <File className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm text-foreground font-medium">Document</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <div onClick={openGallery} className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-600/20">
                            <Image className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-foreground font-medium">Gallery</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-pink-600/20">
                            <Camera className="h-4 w-4 text-pink-600" />
                        </div>
                        <p className="text-sm text-foreground font-medium">Camera</p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-yellow-600/20">
                            <MapPin className="h-4 w-4 text-yellow-600" />
                        </div>
                        <p className="text-sm text-foreground font-medium">Location</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default PaperClip;
