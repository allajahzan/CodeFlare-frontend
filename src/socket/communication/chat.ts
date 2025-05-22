import { socket } from "./connection";

/**
 * Emits a "registerUser" event to the socket server with the provided userId.
 * @param userId - The ID of the user to register with the socket server.
 */
export const registerUser = (userId: string) => {
    socket.emit("registerUser", userId);
};

/**
 * Emits a "userOnline" event to the socket server to check the online status of a user.
 * @param receiverId - The ID of the user to check the online status of.
 */
export const userOnline = (receiverId: string) => {
    socket.emit("userOnline", receiverId);
};

/**
 * Listens for "userOnline" events from the socket server and executes the given callback.
 * @param callback - A function to be called with the online status of the user.
 */
export const listenUserOnline = (
    callback: (data: { receiverId: string; isOnline: boolean }) => void
) => {
    socket.on("userOnline", (data) => {
        callback(data);
    });
};

export const userTyping = (
    senderId: string,
    receiverId: string,
    isTyping: boolean
) => {
    socket.emit("userTyping", { senderId, receiverId, isTyping });
};

export const listenUserTyping = (
    receiverId: string,
    callback: (data: {
        senderId: string;
        receiverId: string;
        isTyping: boolean;
    }) => void
) => {
    socket.on("userTyping", (data) => {
        if (data.receiverId === receiverId) {
            callback(data);
        }
    });
};

/**
 * Emits a "sendPrivateMessage" event to the socket server with the provided senderId, receiverId, and message.
 * @param senderId - The ID of the user who sent the message.
 * @param receiverId - The ID of the user who received the message.
 * @param message - The message to be sent.
 */
export const sendPrivateMessage = (
    senderId: string,
    receiverId: string,
    content: "image" | "text" | "file",
    message: string
) => {
    socket.emit("sendPrivateMessage", { senderId, receiverId, content, message });
};

/**
 * Listens for "receivePrivateMessage" events from the socket server and triggers the provided callback only if the message is intended for the provided receiverId.
 * @param receiverId - The ID of the user who should receive the message.
 * @param callback - The callback function to be triggered when a message is received.
 */
// Interface for user details
interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
}

export const receivePrivateMessage = (
    userId: string,
    callback: (data: {
        senderId: string;
        receiverId: string;
        sender: IUser;
        content: "image" | "text" | "file";
        message: string;
    }) => void
) => {
    socket.on("receivePrivateMessage", (message) => {
        if (message.receiverId === userId) {
            callback(message);
        }
    });
};

/**
 * Listens for "chatInfo" events from the socket server and triggers the provided callback
 * only if the chat contains the senderId.
 * @param senderId - The ID of one of the users in the chat.
 * @param callback - The callback function to be triggered when a chat is received that contains both the senderId and receiverId.
 */
export const chatInfo = (
    userId: string,
    callback: (chat: {
        chatId: string;
        senderId: string;
        receiverId: string;
    }) => void
) => {
    socket.on("chatInfo", (data) => {
        if (
            data.chatInfo.senderId === userId ||
            data.chatInfo.receiverId === userId
        ) {
            callback(data.chatInfo);
        }
    });
};

/**
 * Emits a "loadMoreMessages" event to the socket server with the provided chatId and skip value.
 * @param chatId - The ID of the chat for which more messages are to be loaded.
 * @param skip - The number of messages to skip for pagination.
 */
export const loadMoreMessages = (
    userId: string,
    chatId: string,
    skip: number
) => {
    socket.emit("loadMoreMessages", { userId, chatId, skip });
};

/**
 * Listens for "loadedMessages" events from the socket server and triggers the provided callback
 * when more messages are loaded for the provided chatId.
 * @param chatId - The ID of the chat for which more messages are to be loaded.
 * @param callback - The callback function to be triggered when more messages are loaded.
 */
export const loadedMessages = (
    userId: string,
    chatId: string,
    callback: ({ }) => void
) => {
    socket.on("loadedMessages", (data) => {
        if (chatId === data.chatId && userId === data.userId) {
            callback(data.messages);
        }
    });
};