// Interface for Reply
export interface IReply {
    message: string;
    date: string;
}

// Interface for Warning
export interface IWarning {
    _id: string;
    message: string;
    date: string;
    reply: IReply[];
}