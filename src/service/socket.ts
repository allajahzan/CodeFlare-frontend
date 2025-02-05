import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_IO_SERVER_URL);

/**
 * Emits a "registerUser" event to the socket server with the provided userId.
 * @param userId - The ID of the user to register with the socket server.
 */
export const registerUser = (userId: string) => {
    socket.emit("registerUser", userId);
};

/**
 * Emits a "privateMessage" event to the socket server with the provided senderId, receiverId, and message.
 * @param senderId - The ID of the user who sent the message.
 * @param receiverId - The ID of the user who received the message.
 * @param message - The message to be sent.
 */
export const sendPrivateMessage = (
    senderId: string,
    receiverId: string,
    message: string
) => {
    socket.emit("sendPrivateMessage", { senderId, receiverId, message });
};

/**
 * Listens for "receivePrivateMessage" events from the socket server and triggers the provided callback only if the message is intended for the provided receiverId.
 * @param receiverId - The ID of the user who should receive the message.
 * @param callback - The callback function to be triggered when a message is received.
 */
export const listenForMessages = (
    userId: string,
    callback: (data: {
        senderId: string;
        receiverId: string;
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
 * Listens for "chats" events from the socket server and triggers the provided callback
 * only if the chat contains the senderId.
 * @param senderId - The ID of one of the users in the chat.
 * @param callback - The callback function to be triggered when a chat is received that contains both the senderId and receiverId.
 */
interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
}
export const ListenForChats = (
    userId: string,
    callback: (chat: {
        chatId: string;
        sender: User;
        receiver: User;
        lastMessage: string;
        updatedAt: Date;
    }) => void
) => {
    socket.on("chats", (data) => {
        if (data.chat.sender._id === userId || data.chat.receiver._id === userId) {
            callback(data.chat);
        }
    });
};

export default socket;
