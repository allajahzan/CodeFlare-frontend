import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Account from "./account";
import { Camera } from "lucide-react";
import image from "@/assets/images/loginImage3.jpg";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import UserInfo from "./user-info";
import Password from "./password";
import SocialLinks from "./social-links";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { IProfile } from "@/types/profile";

// Profile Componet
function Profile() {
    // bg-image state
    const [bgImage, setBgImage] = useState<string | null>(null);

    // profile
    const [profile, setProfile] = useState<IProfile>({
        name: "",
        phoneNumber: "",
        bio: "",
        about: "",
        softSkills: "",
        techSkills: "",
        work: "",
        education: "",
        portfolio: "",
        github: "",
        linkedin: "",
        instagram: "",
    });

    const [fetching, setFetching] = useState<boolean>(true);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Fetch profile info
    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const resp = await fetchData(ApiEndpoints.PROFILE, role);

                if (resp && resp.status === 200) {
                    const data = resp.data.data;
                    if (data) {
                        setProfile(() => {
                            return {
                                name: data.userDetails.name,
                                phoneNumber: data.userDetails.phoneNumber || "",
                                bio: data.bio || "",
                                about: data.about || "",
                                softSkills: data.softSkills || "",
                                techSkills: data.techSkills || "",
                                work: data.work || "",
                                education: data.education || "",
                                portfolio: data.portfolio || "",
                                github: data.github || "",
                                linkedin: data.linkedin || "",
                                instagram: data.instagram || "",
                            };
                        });
                    }
                    setFetching(false);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        fetchProfileInfo();
    }, []);

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
                            "absolute z-10 right-5 top-[50%] -translate-y-1/2 p-2 rounded-full cursor-pointer",
                            bgImage ? "bg-white/10" : "bg-white dark:bg-muted"
                        )}
                    >
                        <Camera
                            className={cn(
                                "w-4 h-4",
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
                {!fetching && (
                    <div className="relative top-10 pt-10 px-0 sm:px-0 flex flex-col gap-2 transition-all duration-300">
                        <Tabs defaultValue="Account" className="w-full flex flex-col gap-4">
                            <TabsList className="grid w-full grid-cols-3 dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner">
                                <TabsTrigger className="text-foreground" value="Account">
                                    Account
                                </TabsTrigger>
                                <TabsTrigger className="text-foreground" value="Password">
                                    Password
                                </TabsTrigger>
                                <TabsTrigger className="text-foreground" value="Urls">
                                    Social Links
                                </TabsTrigger>
                            </TabsList>
                            <div
                                className="relative p-5 h-[calc(100vh-320px)] border rounded-2xl overflow-auto no-scrollbar
                    shadow-sm dark:shadow-customBorder dark:shadow-inner"
                            >
                                {/* Account */}
                                <TabsContent value="Account">
                                    <Account profile={profile} />
                                </TabsContent>

                                {/* Password */}
                                <TabsContent value="Password">
                                    <Password />
                                </TabsContent>

                                {/* Social links */}
                                <TabsContent value="Urls">
                                    <SocialLinks profile={profile} />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                )}
            </div>

            <div
                className="hidden md:block h-full p-5 bg-zinc-0 rounded-2xl border border-transparent
            bg-muted dark:bg-sidebar shadow-sm dark:shadow-customBorder dark:shadow-inner"
            ></div>
        </div>
    );
}

export default Profile;
