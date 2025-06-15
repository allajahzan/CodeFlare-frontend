import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from "react";
import { toast } from "@/hooks/use-toast";
import { socket } from "@/socket/communication/connection";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";

export interface ISnapshotContext {
    snapshotMessage: string;
    setSnapshotMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Snapshot Context
const SnapshotContext = createContext<ISnapshotContext | null>(null);

// Custom hook
const useSnapshot = () => useContext(SnapshotContext);

// Snapshot context provider
const SnapshotContextProvider = ({ children }: { children: ReactNode }) => {
    // Redux
    const isCheckedIn = useSelector((state: stateType) => state.isCheckedIn);

    // Snapshot message
    const [snapshotMessage, setSnapshotMessage] = useState<string>("");

    // Alarm for new snapshot message
    useEffect(() => {
        if (snapshotMessage) {
            toast({ title: snapshotMessage, description: "Break snapshot" });
        }
    }, [snapshotMessage]);

    // Recieving snapshot messages
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        // Timeout
        const setupTimeout = (expiry: number) => {
            const remaining = expiry - Date.now();

            if (remaining > 0) {
                timeoutId = setTimeout(() => {
                    setSnapshotMessage("");
                    localStorage.removeItem("snapshotMessage");
                }, remaining);
            } else {
                // Expired already
                setSnapshotMessage("");
                localStorage.removeItem("snapshotMessage");
            }
        };

        if (isCheckedIn) {
            // Restore from localStorage on load
            const saved = localStorage.getItem("snapshotMessage");
            if (saved) {
                const { value, expiry } = JSON.parse(saved);
                if (expiry && value) {
                    setSnapshotMessage(value);
                    setupTimeout(expiry);
                }
            }

            const handleSnapshot = (data: { message: string }) => {
                setSnapshotMessage(data.message);

                const now = Date.now();
                const expiry = now + 10 * 60 * 1000;

                // Save to local storage
                localStorage.setItem(
                    "snapshotMessage",
                    JSON.stringify({ value: data.message, expiry })
                );

                if (timeoutId) clearTimeout(timeoutId);
                setupTimeout(expiry);
            };

            socket.on("reciveSnapshotMessage", handleSnapshot);

            return () => {
                socket.off("reciveSnapshotMessage", handleSnapshot);
                if (timeoutId) clearTimeout(timeoutId);
            };
        }
    }, [isCheckedIn]);

    return (
        <SnapshotContext.Provider value={{ snapshotMessage, setSnapshotMessage }}>
            {children}
        </SnapshotContext.Provider>
    );
};

export { SnapshotContextProvider, useSnapshot };
