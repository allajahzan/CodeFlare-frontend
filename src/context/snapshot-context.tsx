import React, { createContext, useState, useEffect, ReactNode } from "react";
// import warningAlarm from "@/assets/music/warning-alarm.mp3";
import { toast } from "@/hooks/use-toast";
import {
    reciveSnapshotMessage,
    socket,
} from "@/socket/notification/notification-socket";

export interface ISnapshotContext {
    snapshotMessage: string;
    setSnapshotMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Snapshot Context
const SnapshotContext = createContext<ISnapshotContext | null>(null);

// Snapshot context provider
const SnapshotContextProvider = ({ children }: { children: ReactNode }) => {
    // Snapshot message
    const [snapshotMessage, setSnapshotMessage] = useState<string>(
        getItemWithExpiry("snapshotMessage")
    );

    // Alaram
    useEffect(() => {
        if (snapshotMessage) {
            // const audio = new Audio(warningAlarm);
            // audio.load();
            // audio.play();

            toast({ title: snapshotMessage });
        }
    }, [snapshotMessage]);

    // Listen for snapshot messages
    useEffect(() => {
        reciveSnapshotMessage((data) => {
            // Update state and localstorage
            setSnapshotMessage(data.message);

            const now = new Date();

            const item = {
                value: data.message,
                expiry: now.getTime() + 5 * 60 * 1000,
            };

            // Update localstorage with expiry time of 5 minutes
            localStorage.setItem("snapshotMessage", JSON.stringify(item));
        });

        // Clean up
        return () => {
            socket.off("reciveSnapshotMessage");
        };
    }, []);

    // Get snapshot message from localstorage
    function getItemWithExpiry(key: string): string {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return "";

        try {
            const item = JSON.parse(itemStr);
            const now = new Date();

            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return "";
            }

            return item.value;
        } catch {
            return "";
        }
    }

    return (
        <SnapshotContext.Provider value={{ snapshotMessage, setSnapshotMessage }}>
            {children}
        </SnapshotContext.Provider>
    );
};

export { SnapshotContext, SnapshotContextProvider };
