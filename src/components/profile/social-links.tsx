import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Loader, UserRound } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMediaQuery } from "usehooks-ts";

// Social links Components
function SocialLinks() {
    // Screen size
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
            {/* Left side */}
            <div className="flex flex-col gap-2">
                {/* Portfolio */}
                <motion.div
                    className="space-y-2 relative"
                    key={2}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Label
                        htmlFor="portfolio"
                        className="text-sm text-foreground font-medium"
                    >
                        Portfolio
                    </Label>
                    <div className="relative">
                        <Input
                            id="portfolio"
                            type="email"
                            placeholder="Portfolio URL"
                            autoComplete="off"
                            required
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <UserRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* LinkedIn */}
                <motion.div
                    className="space-y-2 relative"
                    key={2}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Label
                        htmlFor="linkedIn"
                        className="text-sm text-foreground font-medium"
                    >
                        LinkedIn
                    </Label>
                    <div className="relative">
                        <Input
                            id="linkedIn"
                            type="email"
                            placeholder="LinkedIn URL"
                            autoComplete="off"
                            required
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Linkedin className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>
            </div>

            {/* Right side */}
            <div className="flex flex-col gap-2">
                {/* Github */}
                <motion.div
                    className="space-y-2 relative"
                    key={1}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSmall ? 0.5 : 0.2 }}
                >
                    <Label
                        htmlFor="github"
                        className="text-sm text-foreground font-medium"
                    >
                        GitHub
                    </Label>
                    <div className="relative">
                        <Input
                            id="github"
                            type="text"
                            placeholder="GitHub URL"
                            autoComplete="off"
                            required
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Github className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* Instagram */}
                <motion.div
                    className="space-y-2 relative"
                    key={1}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSmall ? 0.6 : 0.3 }}
                >
                    <Label
                        htmlFor="instagram"
                        className="text-sm text-foreground font-medium"
                    >
                        Instagram
                    </Label>
                    <div className="relative">
                        <Input
                            id="instagram"
                            type="text"
                            placeholder="Instagram URL"
                            autoComplete="off"
                            required
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Instagram className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* button */}
                <motion.div
                    key={9}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSmall ? 0.7 : 0.4 }}
                    className="pt-2 w-full"
                >
                    <Button
                        variant="default"
                        type="submit"
                        className="w-full h-11 sh:cursor-not-allowed"
                    >
                        {false ? (
                            <div className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            "Add"
                        )}
                    </Button>
                </motion.div>
            </div>
        </motion.form>
    );
}

export default SocialLinks;
