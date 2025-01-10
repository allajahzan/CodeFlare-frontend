import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface PropsType {
    button: ReactNode;
}

function AddUserModal({ button }: PropsType) {
    return (
        <Dialog>
            <DialogTrigger>{button}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogTitle className="hidden" />
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold">Share 1 item</h2>
                            <p className="text-sm text-gray-500">dune_ss_93.mov</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddUserModal;
