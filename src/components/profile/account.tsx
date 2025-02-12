import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Book,
    Briefcase,
    Info,
    Loader,
    Mail,
    Phone,
    UserRound,
    UsersRound,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function Account() {
    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
            {/* Left side */}
            <div className="flex flex-col gap-2">
                {/* Full name */}
                <motion.div
                    className="space-y-2 relative"
                    key={1}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Label htmlFor="name" className="text-sm text-foreground font-medium">
                        Full Name
                    </Label>
                    <div className="relative">
                        <Input
                            id="name"
                            type="text"
                            placeholder="Full Name"
                            autoComplete="off"
                            required
                            value={"Ahsan allaj pk"}
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <UserRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    className="space-y-2 relative"
                    key={2}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Label
                        htmlFor="email"
                        className="text-sm text-foreground font-medium"
                    >
                        Email
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="off"
                            required
                            disabled
                            value={"ahsanallajpk22@gmail.com"}
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* Phone number */}
                <motion.div
                    className="space-y-2 relative"
                    key={3}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Label
                        htmlFor="phoneNo"
                        className="text-sm text-foreground font-medium"
                    >
                        Phone Number
                    </Label>
                    <div className="relative">
                        <Input
                            id="phoneNo"
                            type="text"
                            placeholder="Phone Number"
                            autoComplete="off"
                            required
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Phone className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* Role */}
                <motion.div
                    className="space-y-2 relative"
                    key={4}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Label htmlFor="role" className="text-sm text-foreground font-medium">
                        Role
                    </Label>
                    <div className="relative">
                        <Input
                            id="role"
                            type="text"
                            placeholder="Role"
                            autoComplete="off"
                            required
                            disabled
                            value={"Student"}
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Briefcase className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* Batch */}
                <motion.div
                    className="space-y-2 relative"
                    key={5}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Label
                        htmlFor="batch"
                        className="text-sm text-foreground font-medium"
                    >
                        Batch
                    </Label>
                    <div className="relative">
                        <Input
                            id="batch"
                            type="text"
                            placeholder="Batch"
                            autoComplete="off"
                            value={"Batch 1"}
                            disabled
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>
            </div>

            {/* Right side */}
            <div className="col-span-1 flex flex-col gap-2">
                {/* Bio */}
                <motion.div
                    className="space-y-2 relative"
                    key={6}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Label htmlFor="bio" className="text-sm text-foreground font-medium">
                        Bio
                    </Label>
                    <div className="relative">
                        <Input
                            id="bio"
                            type="text"
                            placeholder="Bio"
                            autoComplete="off"
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Info className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                {/* About me */}
                <motion.div
                    className="space-y-2 relative"
                    key={7}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Label
                        htmlFor="aboutme"
                        className="text-sm text-foreground font-medium"
                    >
                        About Me
                    </Label>
                    <div className="relative">
                        <Textarea
                            id="aboutme"
                            autoComplete="off"
                            className="text-foreground font-medium h-[145px] resize-none"
                        />
                        {/* <Info className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" /> */}
                    </div>
                </motion.div>

                {/* Skills */}
                <motion.div
                    className="space-y-2 relative"
                    key={8}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Label
                        htmlFor="skills"
                        className="text-sm text-foreground font-medium"
                    >
                        Skills
                    </Label>
                    <div className="relative">
                        <Input
                            id="skills"
                            type="text"
                            placeholder="Skills"
                            autoComplete="off"
                            className="p-5 pl-9 text-foreground font-medium"
                        />
                        <Book className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    </div>
                </motion.div>

                <div className="flex gap-3">
                    <motion.div
                        key={9}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-2 w-full"
                    >
                        <Button
                            variant="default"
                            type="submit"
                            className="w-full h-11 shadow-lg disabled:cursor-not-allowed"
                        >
                            {false ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.form>
    );
}

export default Account;
