import { Camera, File, Image, MapPin, Paperclip } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IUserChat } from "./user-contact-sheet";
import { Chat, Message } from "./chat";
import { useContext } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import { uploadImageToCloudinary } from "@/service/cloudinary";
import { sendPrivateMessage } from "@/socket/communication/chatSocket";
import { toast } from "@/hooks/use-toast";

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
    setSelectedChat,
}: PropsType) {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Open gallery
    const openGallery = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg, image/jpg";
        input.multiple = true;
        input.style.display = "none";

        // Event listener
        input.addEventListener("change", (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
                // Convert to base 64 format
                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = async () => {
                    // Base 64 formate
                    const imageUrl = reader.result as string;

                    // Formatted message with image data
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

                    // Get image url
                    const status = await uploadImageToCloudinary(files[0]);

                    if (status) {
                        // Update users with formatted user chat
                        setUser((prevUsers: IUserChat[]) => {
                            const filteredUserChats = prevUsers.filter(
                                (userChat) => userChat._id !== formattedUserChat._id
                            );
                            return [formattedUserChat, ...filteredUserChats];
                        });

                        // Emit event to send image
                        sendPrivateMessage(
                            user?._id as string,
                            selectedUser?._id as string,
                            "image",
                            status
                        );
                    } else {
                        // Remove sent message from chat
                        setSelectedChat((prevChat) => ({
                            ...prevChat,
                            messages: [...prevChat.messages.slice(0, -1)],
                        }));

                        // Toast
                        toast({ title: "Network error, please try again later!" });
                    }
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
                <div className="p-3 rounded-lg border border-border bg-background hover:bg-muted dark:hover:bg-sidebar dark:hover:border-customBorder-dark shadow-sm">
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
                <DropdownMenuItem onClick={openGallery}>
                    <div className="flex items-center gap-2">
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
