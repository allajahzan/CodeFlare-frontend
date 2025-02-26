import { IBatch } from "@/components/admin/batch/batches";

// Interface for Student
export interface Student {
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
