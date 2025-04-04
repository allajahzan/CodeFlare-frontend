import { IBatch } from "./batch"

// Interface for user
export interface IUser{
    _id: string, 
    name: string,
    email: string, 
    role: string, 
    profilePic: string,
    batch: string
}

// Interface for selfie
export interface ISelfie {
    name: string,
    time: string,
    photo: string,
    location: string,
    isVerified: boolean
}

// Interface for Attendence
export interface IAttendence{
    _id: string,
    userId: string,
    batchId: string,
    date: Date,
    checkIn: string | null,
    checkOut: string | null,
    status: string,
    isApproved: boolean, 
    isPartial: boolean,
    reason: {
        time: string,
        description: string,
    }
    selfies : ISelfie[]
    user: IUser
    batch: IBatch
}
