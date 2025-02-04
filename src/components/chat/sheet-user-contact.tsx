import { useEffect, useState } from "react";
import { Filter, Plus, Search, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { cn } from "@/lib/utils";
import { Chat } from "./chat";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";

interface U {
    id: number;
    sender: string;
    senderEmail: string;
    messages: any[];
}

const u: U[] = [
    {
        id: 1,
        sender: "Allaj",
        senderEmail: "allaj@gmail.com",
        messages: [],
    },
];

// Interface for Props
interface PropsType {
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
}

// User contact Sheet
function UserContactSheet({ setSelectedChat, isOpen, setIsOpen }: PropsType) {
    // Users
    const [users, setUsers] = useState<U[]>(u);

    useEffect(() => { }, [
        
    ]);

    return (
        <div
            className={cn(
                "h-full w-full bg-background absolute top-0 left-0 transition-all duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Header */}
            <div className="py-5 pt-6 flex flex-col gap-5 bg-white dark:bg-transparent sticky top-0 border-b border-border">
                <div className="flex items-center gap-2 px-5">
                    <div className="p-2 bg-muted rounded-full">
                        <UsersRound className="w-4 h-4 text-foreground" />
                    </div>

                    <p className="flex-1 text-lg text-foreground font-bold">Contacts</p>

                    <div
                        onClick={() => setIsOpen(false)}
                        className="p-3 rounded-full hover:bg-muted"
                    >
                        <Plus className="w-4 h-4 rotate-45 text-foreground" />
                    </div>
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

                    {/* Filter user */}
                    <IconButton Icon={Filter} />
                </div>
            </div>

            {/* Content */}
            <div className="p-0">
                {users.map((user: U, index: number) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedChat(user);
                            // setIsOpen(false);
                        }}
                        className={cn(
                            "flex-1 py-[9.4px] px-5 rounded-none border-x-0 border-y-0 bg-background dark:bg-transparent hover:bg-muted dark:hover:bg-sidebar",
                            index !== users.length - 1 ? "border-b-[1px]" : ""
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {/* Avatar profile pic */}
                            <Avatar className="bg-background w-12 h-12 border-2">
                                {false && (
                                    <AvatarImage src={"image"} className="object-cover" />
                                )}
                                <AvatarFallback className="bg-transparent">
                                    <img className="w-full" src={profile} alt="" />
                                </AvatarFallback>
                            </Avatar>

                            {/* Name and other details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground truncate">
                                        {user.sender}
                                    </p>
                                </div>
                                {/* {children1} */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserContactSheet;
