import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import allaj from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Account from "./account";
import { Camera, Mail, Plus } from "lucide-react";
import image from '@/assets/images/loginImage3.jpg'
import { useState } from "react";
import { cn } from "@/lib/utils";

// Profile Componet
function Profile() {

    // bg-image state
    const [bgImage, setBgImage] = useState<string | null>(null)

    return (
        <div className="p-5 pt-0 grid grid-cols-3 gap-5 overflow-hidden">
            {/* First section */}
            <div className="relative h-[calc(100vh-108px)] gap-3 col-span-3 md:col-span-2">
                {/* Background div */}
                <div
                    className="w-full relative h-20 rounded-2xl bg-muted dark:bg-sidebar shadow-sm 
                dark:shadow-customBorder dark:shadow-inner overflow-hidden"
                >
                    {bgImage && <img src={image} className="object-cover object-center h-full w-full bg-no-repeat"/>}
                    <div className={cn("absolute z-10 right-5 top-[50%] -translate-y-1/2 p-3 rounded-full cursor-pointer", 
                        bgImage? "hover:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                        )}>
                        <Camera className={cn("w-5 h-5", bgImage? 'text-background dark:text-foreground' : 'text-foreground')} />
                    </div>
                </div>

                {/* User info */}
                <div className="absolute w-fit top-11 sm:top-6 flex items-end px-0 sm:px-5 gap-3">
                    {/* Avatar pic */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <Avatar className="bg-background w-[90px] h-[90px] sm:w-28 sm:h-28 border-4 border-transparent dark:border-border shadow-lg">
                            {true && <AvatarImage src={allaj} className="object-cover" />}
                            <AvatarFallback className="bg-transparent">
                                <img src={profile} alt="" />
                            </AvatarFallback>
                        </Avatar>

                        {/* Add icon */}
                        <div
                            className="absolute bottom-0 right-2 w-6 h-6 bg-background shadow-custom rounded-full flex items-center justify-center
                        dark:border-2 dark:border-border"
                        >
                            <Plus className="w-4 h-4 text-foreground" />
                        </div>
                    </motion.div>

                    {/* User name and role */}
                    <div className="flex flex-col justify-center gap-4">
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-2">
                                <p className="text-base sm:text-lg text-foreground font-semibold truncate">
                                    Ahsan allaj pk
                                </p>
                                <Badge className="relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
                                    Student
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium  tracking-wide flex items-center gap-1 w-full truncate">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                ahsanallajpk@23gmail.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs and tab content */}
                <div className="relative top-20 flex flex-col gap-2 p-5 pt-0 overflow-auto">
                    <Tabs defaultValue="Account" className="w-full flex flex-col gap-4">
                        <TabsList className="grid w-full grid-cols-3 dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner">
                            <TabsTrigger value="Account">Account</TabsTrigger>
                            <TabsTrigger value="Password">Password</TabsTrigger>
                            <TabsTrigger value="Urls">Social Links</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="Account"
                            className="relative h-[calc(100vh-328px)] overflow-auto no-scrollbar"
                        >
                            {/* Account */}
                            <Account />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div
                className="hidden md:block h-full p-5 bg-zinc-0 rounded-2xl border border-transparent
            bg-muted dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner"
            ></div>
        </div>
    );
}

export default Profile;
