import { IBatch } from "@/types/batch";

// Interface for Student
export interface IStudent {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
    batch: IBatch;
    week: string;
    isblock: boolean;
    lastActive: string;
    createdAt: string;
}
