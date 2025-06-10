import { IBatch } from "@codeflare/common";
import { IStudent } from "./IStudent";

// Interface for selfie
export interface ISelfie {
    name: string;
    time: string;
    photo: string;
    location: string;
    isVerified: boolean;
}

// Interface for Attendence
export interface IAttendence {
    _id: string;
    userId: string;
    batchId: string;
    date: Date;
    checkIn: string | null;
    checkOut: string | null;
    status: "Pending" | "Present" | "Absent" | "Late";
    isApproved: boolean | null;
    reason: {
        time: string;
        description: string;
    };
    selfies: ISelfie[];
    user: IStudent;
    batch: IBatch;
}
