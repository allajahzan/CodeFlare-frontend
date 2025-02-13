import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Account from "./account";
import { Camera } from "lucide-react";
import image from "@/assets/images/loginImage3.jpg";
import { useState } from "react";
import { cn } from "@/lib/utils";
import UserInfo from "./user-info";
import Password from "./password";

// Profile Componet
function Profile() {
    // bg-image state
    const [bgImage, setBgImage] = useState<string | null>(null);

    return (
        <div className="p-5 pt-0 grid grid-cols-3 gap-5 overflow-hidden">
            {/* First section */}
            <div className="relative h-[calc(100vh-108px)] gap-3 col-span-3 md:col-span-2">
                {/* Background div */}
                <div
                    className="w-full relative h-20 rounded-2xl bg-muted dark:bg-sidebar shadow-sm 
                dark:shadow-customBorder dark:shadow-inner overflow-hidden"
                >
                    {bgImage && (
                        <img
                            src={image}
                            className="object-cover object-center h-full w-full bg-no-repeat"
                        />
                    )}
                    <div
                        className={cn(
                            "absolute z-10 right-5 top-[50%] -translate-y-1/2 p-3 rounded-full cursor-pointer",
                            bgImage ? "bg-white/10" : "bg-white dark:bg-muted"
                        )}
                    >
                        <Camera
                            className={cn(
                                "w-5 h-5",
                                bgImage
                                    ? "text-background dark:text-foreground"
                                    : "text-foreground"
                            )}
                        />
                    </div>
                </div>

                {/* User info */}
                <UserInfo />

                {/* Tabs and tab content */}
                <div className="relative top-10 pt-10 px-0 sm:px-5 flex flex-col gap-2 transition-all duration-300">
                    <Tabs defaultValue="Account" className="w-full flex flex-col gap-4">
                        <TabsList className="grid w-full grid-cols-3 dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner">
                            <TabsTrigger value="Account">Account</TabsTrigger>
                            <TabsTrigger value="Password">Password</TabsTrigger>
                            <TabsTrigger value="Urls">Social Links</TabsTrigger>
                        </TabsList>
                        <div className="relative h-[calc(100vh-320px)]  overflow-auto no-scrollbar">
                            {/* Account */}
                            <TabsContent value="Account">
                                <Account />
                            </TabsContent>

                            {/* Password */}
                            <TabsContent value="Password">
                                <Password />
                            </TabsContent>
                        </div>
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
