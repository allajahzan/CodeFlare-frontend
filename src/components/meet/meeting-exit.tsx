import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { socket } from "@/socket/communication/connect";
import * as mediasoupClient from "mediasoup-client";

// Interface for Props
interface PropsType {
    setDevice: React.Dispatch<
        React.SetStateAction<mediasoupClient.types.Device | null>
    >;
    setJoined: React.Dispatch<React.SetStateAction<boolean | null>>;
    setMeetLeft: React.Dispatch<React.SetStateAction<boolean>>;
}

// Meeting exist page Component
function MeetingExit({ setDevice, setJoined, setMeetLeft }: PropsType) {
    // Count state
    const [countdown, setCountdown] = useState(30);

    const navigate = useNavigate();
    const path = useLocation();

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context

    const roomId = path.pathname.split("/")[3];

    // Handle Rejoin
    async function reJoinRoom() {
        // Update states for changing UI
        setJoined(true);
        setMeetLeft(false);

        // Emit event
        try {
            socket.emit(
                "joinRoom",
                { roomId },
                async (
                    rtpCapabilities: mediasoupClient.types.RtpCapabilities,
                    existingPeer: any
                ) => {
                    const newDevice = new mediasoupClient.Device();
                    await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
                    setDevice(newDevice);

                    console.log(existingPeer);
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    // Count down
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(`/${role}/meet`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-5 items-center justify-center h-screen p-5">
            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                {/* Count down */}
                <div className="relative mb-8 flex flex-col items-center justify-center">
                    <div className="relative h-16 w-16 rounded-full flex items-center justify-center">
                        {/* SVG Ring */}
                        <svg
                            className="absolute top-0 left-0 h-full w-full"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                className="text-muted"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="46"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className="text-foreground"
                                strokeWidth="8"
                                strokeDasharray={290}
                                strokeDashoffset={290 - (290 * countdown) / 30}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="46"
                                cx="50"
                                cy="50"
                            />
                        </svg>

                        {/* Countdown number */}
                        <span className="text-base font-semibold text-foreground z-10">
                            {countdown}
                        </span>
                    </div>

                    {/* Text below */}
                    <p className="mt-5 text-sm text-foreground font-medium text-center">
                        Returning to home screen
                    </p>
                </div>

                <h1 className="text-3xl font-semibold text-foreground mb-8">
                    You left the meeting
                </h1>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button
                        onClick={reJoinRoom}
                        variant="outline"
                        className="h-11 text-foreground duration-0"
                    >
                        Rejoin
                    </Button>
                    <Button
                        onClick={() => navigate(`/${role}/meet`)}
                        className="h-11 disabled:cursor-not-allowed mb-12"
                    >
                        Return to home screen
                    </Button>
                </div>

                <Card className="w-full max-w-md p-5 border shadow-sm bg-background dark:bg-sidebar-background">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">
                                Your meeting is safe
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                No one can join a meeting unless invited or admitted by the host
                            </p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}

export default MeetingExit;
