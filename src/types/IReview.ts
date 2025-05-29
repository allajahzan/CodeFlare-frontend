import { IBatch, IReviewCategory, IWeek } from "@codeflare/common";
import { IStudent } from "./IStudent";
import { IUser } from "./IUser";

// Interface for Review
export interface IReview {
    _id: string;
    instructor: IUser;
    student: IStudent;
    batch: IBatch;
    week: IWeek;
    title: string;
    date: Date;
    time: string;
    category: IReviewCategory;
    feedback: string;
    pendings: string[];
    score: {
        practical: number;
        theory: number;
    } | null;
    status: string;
    result: string | null;
    rating: number;
    updatedAt: Date,
    createdAt: Date;
}