import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import allaj from "@/assets/images/allaj.jpeg";
import profile from "@/assets/images/no-profile.svg";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Account from "./account";
import { Mail } from "lucide-react";

// Profile Componet
function Profile() {
    return (
        <div className="p-5 pt-0 grid grid-cols-3 gap-5 overflow-hidden">
            {/* First section */}
            <div className="relative h-[calc(100vh-108px)] gap-3 col-span-3 md:col-span-2">
                {/* Background div */}
                <div
                    className="w-full relative h-20 rounded-2xl bg-muted dark:bg-sidebar shadow-sm 
                dark:shadow-customBorder dark:shadow-inner"
                ></div>

                {/* User info */}
                <div className="absolute top-6 flex items-end px-5 gap-3">
                    {/* Avatar pic */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Avatar className="bg-background w-28 h-28 border-4 border-white shadow-md">
                            {true && <AvatarImage src={allaj} className="object-cover" />}
                            <AvatarFallback className="bg-transparent">
                                <img src={profile} alt="" />
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>

                    {/* User name and role */}
                    <div className="flex flex-col justify-center gap-4">
                        <p className="font-medium text-foreground text-sm">
                            Hey, here you can manage your profile.
                        </p>
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-2">
                                <p className="text-lg text-foreground font-semibold truncate">
                                    Ahsan allaj pk
                                </p>
                                <Badge className="hidden lg:block relative text-xs text-white font-semibold bg-zinc-900 dark:bg-muted hover:bg-zinc-900 rounded-full overflow-hidden">
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
                <div className="relative top-20 flex flex-col gap-2 overflow-auto">
                    <Tabs defaultValue="Account" className="w-full flex flex-col gap-4">
                        <TabsList className="grid w-full grid-cols-4 dark:bg-sidebar">
                            <TabsTrigger value="Overview">Overview</TabsTrigger>
                            <TabsTrigger value="Account">Account</TabsTrigger>
                            <TabsTrigger value="Password">Password</TabsTrigger>
                            <TabsTrigger value="Attendence">Attendence</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="Account"
                            className="relative h-[calc(100vh-328px)] overflow-auto no-scrollbar"
                        >
                           {/* Account */}
                           <Account/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div
                className="hidden md:block h-full p-5 bg-zinc-0 rounded-2xl border border-transparent
            bg-muted dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
            </div>
        </div>
    );
}

export default Profile;
