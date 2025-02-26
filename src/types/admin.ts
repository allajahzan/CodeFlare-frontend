import { IBatch } from "@/components/admin/batch/batches";

// Interface for User
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
    batches: IBatch[];
    isblock: boolean;
    createdAt: string;
    lastActive: string;
}