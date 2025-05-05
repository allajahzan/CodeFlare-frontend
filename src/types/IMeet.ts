import { IUserBasic } from "@codeflare/common";

// Interface for Message
export interface IMessage {
    userId: string;
    message: string;
    createdAt: Date;
}

// Interface for Meet
export interface IMeet {
    _id: string;
    roomId: string;
    hostId: string;
    host: IUserBasic;
    invitedUsers: IUserBasic[];
    messages: IMessage[];
}