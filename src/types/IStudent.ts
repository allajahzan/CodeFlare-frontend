import { IBatch, IDomain, IStudentCategory, IWeek } from "@codeflare/common";

// Interface for Student
export interface IStudent {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    role: "student";
    profilePic: string;
    week?: IWeek;
    domain?: IDomain;
    batch: IBatch;
    category: IStudentCategory;
    lastActive: string;
    createdAt: string;
    isBlock: boolean;
}
