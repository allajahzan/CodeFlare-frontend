import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    BriefcaseIcon,
    Loader,
    Mail,
    MessageSquare,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCustomError } from "@/utils/error";
import { postData } from "@/utils/apiService";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { userApi } from "@/api/userApi";
import { User } from "@/types/admin";

// Interface for Props
interface PropsType {
    button: ReactNode;
    setNewUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Add user sheet
function AddUserSheet({ button, setNewUser }: PropsType) {
    // Sheet state
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const [submiting, setSubmiting] = useState(false);

    // Inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [batches, setBatches] = useState<string[]>([]);
    const [message, setMessage] = useState("");

    // Handle select batches
    const handleSelectBatches = (value: string) => {
        setBatches((batches) =>
            batches.includes(value)
                ? batches.filter((batch) => batch !== value)
                : [...batches, value]
        );
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmiting(true);

        try {
            // Send request
            const resp = await postData(userApi.user, {
                name,
                email,
                role,
                batches,
                message,
            });

            const user = resp?.data.data;

            // Success response
            if (resp && resp.status === 200) {
                setTimeout(() => {
                    setSubmiting(false);

                    // Set new user
                    setNewUser(user);

                    // Close sheet
                    setOpen(false);

                    toast({ title: "User added successfully." });
                }, 1000);
            }
        } catch (err: unknown) {
            setTimeout(() => {
                setSubmiting(false);
                handleCustomError(err);
            }, 1000);
        }
    };

    // Clear batches when sheet closes
    useEffect(() => {
        if (!open) {
            setBatches([]);
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
                {/* Header */}
                <SheetHeader className="p-5 bg-zinc-0">
                    <SheetTitle className="text-foreground">Add new user</SheetTitle>
                    <SheetDescription className="font-medium text-foreground">
                        Fill in the information below to add a new user.
                    </SheetDescription>
                </SheetHeader>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 p-5 overflow-auto"
                >
                    {/* Input for name */}
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
                                autoComplete="off"
                                onChange={(event) => setName(event.target.value)}
                                className="font-medium p-5 pl-9"
                            />
                            <UserRoundPlus className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input for email */}
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
                                autoComplete="off"
                                onChange={(event) => setEmail(event.target.value)}
                                className="font-medium p-5 pl-9"
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input for role */}
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
                            <Select
                                key="role"
                                required
                                onValueChange={(value) => setRole(value)}
                            >
                                <SelectTrigger id="role" className="font-medium p-5 pl-9">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                </SelectContent>
                            </Select>
                            <BriefcaseIcon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input for batches */}
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
                            <Select
                                key={"batches"}
                                required
                                onValueChange={(value) => handleSelectBatches(value)}
                            >
                                <SelectTrigger
                                    id="batches"
                                    className="font-medium p-5 pl-9 relative"
                                >
                                    {/* Conditional rendering of SelectValue */}
                                    <SelectValue
                                        placeholder="Select a batch"
                                        className={cn(
                                            "relative transition-opacity duration-200",
                                            batches.length !== 0 && "opacity-0 pointer-events-none"
                                        )}
                                    />
                                    {/* Overlay displaying selected batches */}
                                    <div className="absolute inset-0 flex items-center p-5 pl-9 bg-white">
                                        <p
                                            className={cn(
                                                "transition-opacity duration-200",
                                                batches.length === 0 && "opacity-0"
                                            )}
                                        >
                                            {batches.length > 0 ? batches.join(", ") : null}
                                        </p>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    <SelectItem value="BCK-188">BCK-188</SelectItem>
                                    <SelectItem value="BCK-189">BCK-189</SelectItem>
                                    <SelectItem value="BCK-190">BCK-190</SelectItem>
                                    <SelectItem value="BCK-198">BCK-198</SelectItem>
                                </SelectContent>
                            </Select>
                            <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Input fot message */}
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
                                autoComplete="off"
                                onChange={(event) => setMessage(event.target.value)}
                                className="font-medium p-5 pl-9"
                            />
                            <MessageSquare className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                    >
                        <Button
                            type="submit"
                            disabled={submiting}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {submiting ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
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
