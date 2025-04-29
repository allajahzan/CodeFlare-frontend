import { IUser } from "@codeflare/common";

export interface INotification {
    _id: string;
    sender: IUser;
    type: "warning" | "review" | "info" | "success" | "fail";
    path: string;
    message: string;
    date: string;
}
