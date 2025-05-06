import { IBatch, IDomain } from "@codeflare/common";

// Interface for User
export interface IUser {
    _id: string;
    name: string;
    email: string;
    phoneNo?: string;
    role: "admin" | "coordinator" | "instructor";
    profilePic: string;
    domain?: IDomain;
    batches: IBatch[];
    lastActive: string;
    createdAt: string;
    isBlock: boolean;
}