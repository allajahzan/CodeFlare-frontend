import { IBatch } from "@codeflare/common";
import { IStudent } from "./IStudent";

// Interface for selfie
export interface ISelfie {
    name: string;
    time: string;
    photo: string;
    location: string;
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
    report: {
        time: string;
        description: string;
    };
    selfies: boolean[];
    snapshots: ISelfie[];
    user: IStudent;
    batch: IBatch;
}
