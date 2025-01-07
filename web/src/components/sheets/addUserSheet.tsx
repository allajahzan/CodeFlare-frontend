import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { motion } from "framer-motion";
import {
    BriefcaseIcon,
    Loader2,
    Mail,
    MessageSquare,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "../ui/button";

interface PropsType {
    button: ReactNode;
}

function AddUserSheet({ button }: PropsType) {
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
                <SheetHeader className="p-5 bg-zinc-900">
                    <SheetTitle className="text-muted">Add new user</SheetTitle>
                    <SheetDescription className="font-medium text-muted">
                        Fill in the information below to add a new user.
                    </SheetDescription>
                </SheetHeader>
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 p-5 overflow-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                placeholder="Enter user's full name"
                                required
                                className="font-medium p-5 pl-9"
                            />
                            <UserRoundPlus className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@gmail.com"
                                required
                                className="font-medium p-5 pl-9"
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="role" className="text-sm font-medium">
                            Role
                        </Label>
                        <div className="relative">
                            <Select >
                                <SelectTrigger id="role" className="font-medium p-5 pl-9">
                                    <SelectValue placeholder="Select a role" className="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                </SelectContent>
                            </Select>
                            <BriefcaseIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="role" className="text-sm font-medium">
                            Batches
                        </Label>
                        <div className="relative">
                            <Select>
                                <SelectTrigger id="role" className="font-medium p-5 pl-9">
                                    <SelectValue placeholder="Select a batch" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    <SelectItem value="coordinator">BCK-188</SelectItem>
                                    <SelectItem value="instructor">BCK-189</SelectItem>
                                </SelectContent>
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="message" className="text-sm font-medium">
                            Personal Message (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="message"
                                placeholder="Add a personal message to the invitation"
                                className="font-medium p-5 pl-9"
                            />
                            <MessageSquare className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                    >
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Send Invitation"
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </SheetContent>
        </Sheet>
    );
}

export default AddUserSheet;
