import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/service/cloudinary";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Interface for Porps
interface Propstype {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setSnapshotMessage: React.Dispatch<React.SetStateAction<string>>;
}

// WebCam Modal Component
function WebCamModal({
    open,
    setOpen,
    message,
    setSnapshotMessage,
}: Propstype) {
    // Video and stream ref
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [videoLoading, setVideoLoading] = useState(true);

    // Open camera
    const openCamera = async () => {
        try {
            setVideoLoading(true);

            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;

                videoRef.current.onloadeddata = () => {
                    setVideoLoading(false);
                };
            }
        } catch (err: unknown) {
            console.log(err);
            setVideoLoading(false);
        }
    };

    // Close camera
    const closeCamera = async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        } catch (err: unknown) {
            console.log("Failed to close camera:", err);
        }
    };

    const captureImageFromVideo = async (
        video: HTMLVideoElement
    ): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas context not available");

            // Mirror the video frame if needed
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to PNG Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob); // PNG format by default
                } else {
                    reject("Failed to capture image");
                }
            }, "image/png");
        });
    };

    // Send snapshot
    const sendSnapshot = async () => {
        try {
            if (videoRef.current) {
                const blob = await captureImageFromVideo(videoRef.current);

                // Create a File object
                const file = new File([blob], "snapshot.png", { type: blob.type });

                // Upload to cloudinary
                const status = await uploadImageToCloudinary(file);

                if (status) {
                }
            }
        } catch (err: unknown) {
            console.log("Failed to send snapshot:", err);
        }
    };

    // Open and close camera
    useEffect(() => {
        if (open) {
            openCamera();
        }

        return () => {
            if (open) {
                closeCamera();
            }
        };
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <Camera className="w-4 h-4" />
                        </div>
                        <span>Send snapshot</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                {/* Camera */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-2xl shadow-custom border-4 border-white">
                        <div className="relative overflow-hidden">
                            {videoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted dark:bg-sidebar-backgroundDark rounded-lg z-10">
                                    <Loader2 className="h-7 w-7 animate-spin text-foreground" />
                                </div>
                            )}

                            <div className="relative rounded-xl overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-[300px] transform scale-x-[-1] object-cover`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative cursor-not-allowed">
                        <Button
                            onClick={sendSnapshot}
                            variant="default"
                            type="button"
                            disabled={false}
                            className="h-11 w-full shadow-md disabled:cursor-not-allowed"
                        >
                            {false ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Send snapshot"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default WebCamModal;
