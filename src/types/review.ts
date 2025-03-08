import { IUser } from "@/context/user-context";

// Interface for Review
export interface IReview {
    _id: string;
    instructor: IUser;
    user: IUser;
    batchId: string;
    title: string;
    week: string;
    date: Date;
    time: string;
    rating: number;
    feedback: string;
    pendings: string[];
    score: {
        practical: number;
        theory: number;
    } | null;
    status: string;
    result: string | null;
    updatedAt: Date,
    createdAt: Date;
}