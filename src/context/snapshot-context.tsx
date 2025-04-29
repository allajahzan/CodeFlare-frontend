import React, { createContext, useState, useEffect, ReactNode } from "react";
import warningAlarm from "@/assets/music/warning-alarm.mp3";
import { toast } from "@/hooks/use-toast";
import { reciveSnapshotMessage } from "@/socket/communication/notification";
import { socket } from "@/socket/communication/socket";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

export interface ISnapshotContext {
    snapshotMessage: string;
    setSnapshotMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Snapshot Context
const SnapshotContext = createContext<ISnapshotContext | null>(null);

// Snapshot context provider
const SnapshotContextProvider = ({ children }: { children: ReactNode }) => {
    // Redux
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    // Snapshot message
    const [snapshotMessage, setSnapshotMessage] = useState<string>("");

    // Check if snapshot message is expired
    useEffect(() => {
        setSnapshotMessage(getSnapShotMessageWithExpiry("snapshotMessage"));
    }, []);

    // Alaram for new snapshot message
    useEffect(() => {
        if (snapshotMessage) {
            // Create button
            const button = document.createElement("button");

            // Set onclick attribute
            button.onclick = () => {
                const audio = new Audio(warningAlarm);
                audio.load();
                audio.play();
            };

            // Append to DOM
            document.body.appendChild(button);

            // Trigger click
            button.click();

            // Remove after click to clean up
            document.body.removeChild(button);

            toast({ title: snapshotMessage });
        }
    }, [snapshotMessage]);

    // Listen for new snapshot message
    useEffect(() => {
        // Only if student is checkedIn
        if (isCheckedIn) {
            reciveSnapshotMessage((data: { message: string }) => {
                // Update state
                setSnapshotMessage(data.message);

                // Set expiry to 10 minutes from now
                const now = Date.now();
                const expiry = now + 10 * 60 * 1000;

                const item = {
                    value: data.message,
                    expiry,
                };

                // Save to localStorage
                localStorage.setItem("snapshotMessage", JSON.stringify(item));
            });
        }

        // Cleanup on unmount
        return () => {
            socket.off("reciveSnapshotMessage");
        };
    }, [isCheckedIn]);

    // Get snapshot message from localstorage
    function getSnapShotMessageWithExpiry(key: string): string {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return "";

        try {
            const item = JSON.parse(itemStr);
            const now = new Date();

            const expiry =
                typeof item.expiry === "string" ? Number(item.expiry) : item.expiry;

            if (now.getTime() > expiry) {
                localStorage.removeItem(key);
                return "";
            }

            return item.value;
        } catch (err) {
            console.log("Failed to parse snapshotMessage:", err);
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
