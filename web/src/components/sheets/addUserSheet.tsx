import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Button from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface PropsType {
    button: ReactNode;
}

function AddUserSheet({ button }: PropsType) {
    return (
        <Sheet>
            <SheetTrigger>{button}</SheetTrigger>
            <SheetContent className="p-5 flex flex-col gap-5">
                <SheetHeader className="">
                    <SheetTitle>Add new user</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently add new user.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={() => { }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter user's full name"
                            required
                            className="p-5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            required
                            className="p-5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                            <SelectTrigger id="role" className="p-5">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="coordinator">Coordinator</SelectItem>
                                <SelectItem value="instructor">Instructor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <Input
                            id="message"
                            placeholder="Add a personal message to the invitation"
                            className="p-5"
                        />
                    </div>
                    <Button
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
                        text="Sent Invitation"
                    />
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default AddUserSheet;
