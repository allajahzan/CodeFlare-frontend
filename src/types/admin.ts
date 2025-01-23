// Interface for User
export interface User {
    _id: number;
    name: string;
    email: string;
    role: string;
    profilePic: string;
    batches: string[];
    isBlock: boolean;
    createdAt: string;
    lastActive: string;
}