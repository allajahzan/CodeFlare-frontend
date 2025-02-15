import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useMediaQuery } from "usehooks-ts";

// Password Components
function Password() {
    // Form related states
    const [showPassword, setShowPassword] = useState(false);

    // Screen size
    const isSmall = useMediaQuery("(max-width: 767.20px)");
    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={(event)=>event.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-1 gap-5"
        >
            {/* New password */}
            <motion.div
                className="space-y-2 relative"
                key={1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Label
                    htmlFor="password"
                    className="text-sm text-foreground font-medium"
                >
                    New Password
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "password" : "text"}
                        placeholder="Password"
                        required
                        autoComplete="off"
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 absolute right-0 bottom-[3px] text-muted-foreground hover:text-zinc-500 cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </div>
                </div>
                {/* <ValidationError message={errors.password?.message as string} /> */}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
                className="space-y-2 relative"
                key={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isSmall ? 0.3 : 0.2 }}
            >
                <Label
                    htmlFor="password"
                    className="text-sm text-foreground font-medium"
                >
                    Confirm Password
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "password" : "text"}
                        placeholder="Password"
                        required
                        autoComplete="off"
                        className="p-5 pl-9 text-foreground font-medium"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                    <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 absolute right-0 bottom-[3px] text-muted-foreground hover:text-zinc-500 cursor-pointer"
                    ></div>
                </div>
                {/* <ValidationError message={errors.password?.message as string} /> */}
            </motion.div>

            {/* Button */}
            <motion.div
                key={3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isSmall ? 0.4 : 0.3 }}
                className="pt-2 w-full"
            >
                <Button
                    variant="default"
                    type="submit"
                    className="w-full h-11 shadow-md disabled:cursor-not-allowed"
                >
                    {false ? (
                        <div className="flex items-center gap-2">
                            <Loader className="h-4 w-4 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        "Change"
                    )}
                </Button>
            </motion.div>
        </motion.form>
    );
}

export default Password;
