import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { Ban, Info, Loader, Mail, Plus, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import profile from "@/assets/images/no-profile.svg";

// Interface for Props
interface PropsType {
    button: ReactNode;
}

// User profile sheet Component
function UserProfileSheet({ button }: PropsType) {
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0 overflow-auto">
                {/* Header */}
                <SheetHeader className="p-5 bg-white dark:bg-sidebar sticky top-0">
                    <SheetTitle className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-muted rounded-full">
                            <Info className="w-4 h-4" />
                        </div>
                        <span className="flex-1">User Info</span>
                        <div
                            onClick={() => setOpen(false)}
                            className="p-3 rounded-full hover:bg-muted"
                        >
                            <Plus className="w-4 h-4 rotate-45" />
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <div className="h-full flex flex-col gap-3 items-center bg-muted dark:bg-background">
                    {/* Profile pic */}
                    <div className="w-full py-5 flex flex-col items-center gap-3 bg-white dark:bg-sidebar shadow-sm">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-32 h-32 border-2 rounded-full"
                        >
                            <Avatar className="bg-background">
                                {false && (
                                    <AvatarImage src={"allaj"} className="object-cover" />
                                )}
                                <AvatarFallback className="bg-transparent">
                                    <img src={profile} alt="" />
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>

                        {/* Name and email */}
                        <div className="flex flex-col items-center gap-0">
                            <h1 className="text-xl text-foreground font-semibold">
                                Ahsan allaj pk
                            </h1>
                            <p className="text-muted-foreground font-medium flex gap-1 items-center">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                allaj@gmail.com
                            </p>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="w-full p-5 self-start flex flex-col items-start gap-3 bg-white dark:bg-sidebar shadow-sm">
                        <small className="text-foreground font-bold">About</small>
                        <p className="text-foreground font-medium">
                            I'm your batch coordinator.
                        </p>
                    </div>

                    <div className="w-full p-5 self-start flex flex-col items-start gap-3 bg-white dark:bg-sidebar shadow-sm">
                        <small className="text-foreground font-bold">Media</small>
                        <div className="grid grid-cols-4 gap-5 max-h-[210px] overflow-hidden">
                            <div className="border-2 rounded-lg">
                                <img src={profile} alt="" />
                            </div>
                            <div className="border-2 rounded-lg overflow-hidden">
                                <img src={profile} alt="" />
                            </div>
                            <div className="border-2 rounded-lg overflow-hidden">
                                <img src={profile} alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full py-3 flex flex-col gap-2 bg-white dark:bg-sidebar shadow-sm">
                        <div className="w-full p-5 h-11 flex items-center justify-start hover:bg-muted">
                            {false ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex gap-3 items-center text-foreground">
                                    <Ban className="w-4 h-4" />{" "}
                                    <p className="text-foreground font-medium">Block user</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full p-5 h-11 flex items-center justify-start hover:bg-muted">
                            {false ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex gap-3 items-center text-foreground">
                                    <Trash2 className="w-4 h-4" />{" "}
                                    <p className="text-foreground font-medium">Clear chat</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default UserProfileSheet;
