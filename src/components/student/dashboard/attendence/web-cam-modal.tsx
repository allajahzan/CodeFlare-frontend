import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ApiEndpoints from "@/constants/api-endpoints";
import { IUserContext, UserContext } from "@/context/user-context";
import { toast } from "@/hooks/use-toast";
import { stateType } from "@/redux/store";
import { postData } from "@/service/api-service";
import {
    deleteImageFromCloudinary,
    uploadImageToCloudinary,
} from "@/service/cloudinary";
import { handleCustomError } from "@/utils/error";
import { Camera, Loader2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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

    const [blob, setBlob] = useState<Blob | null>(null);
    const [image, setImage] = useState<string>("");

    // Uploding state
    const [uploading, setUploading] = useState<boolean>(false);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Open camera
    const openCamera = async () => {
        try {
            setVideoLoading(true);

            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;

                    videoRef.current.onloadeddata = () => {
                        setVideoLoading(false);
                    };
                }
            }, 1000);
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

    // Click image
    const captureImageFromVideo = async (video: HTMLVideoElement) => {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("Canvas not available");
                return;
            }

            // Mirror the video frame if needed
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to PNG Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    setBlob(blob); // PNG format by default
                    setImage(URL.createObjectURL(blob));
                } else {
                    throw new Error("Failed to capture image");
                }
            }, "image/png");
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

    // Get latitude and longitude
    const getLatitudeAndLongitude = (): Promise<{
        latitude: number;
        longitude: number;
    }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by this browser."));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                () => {
                    reject(new Error("Failed to get user location."));
                }
            );
        });
    };

    // Get readable location
    const getReadableLocation = async (
        latitude: number,
        longitude: number
    ): Promise<string> => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) throw new Error("Failed to fetch location data.");

        const data = await response.json();

        return data.display_name;
    };

    // Send snapshot
    const sendSnapshot = async () => {
        setUploading(true);

        let publicId;

        try {
            if (blob) {
                // Create a File object
                const file = new File([blob], "snapshot.png", { type: blob.type });

                const { latitude, longitude } = await getLatitudeAndLongitude(); // Get latitude and longitude

                // Get readable location
                const location = await getReadableLocation(latitude, longitude);

                // Upload to cloudinary
                let imageUrl;

                const data = await uploadImageToCloudinary(file);

                if (data) {
                    imageUrl = data.imageUrl;
                    publicId = data.publicId;
                }

                if (imageUrl) {
                    // Send request
                    const resp = await postData(
                        ApiEndpoints.SNAP_SHOT + `/${user?._id}`,
                        {
                            imageUrl,
                            location,
                        },
                        role
                    );

                    // Success response
                    if (resp && resp.status === 200) {
                        setSnapshotMessage("");

                        toast({ title: "Snapshot submitted successfully." });

                        // Clear from localstorage
                        localStorage.removeItem("snapshotMessage");

                        setTimeout(() => {
                            setUploading(false);
                            setOpen(false);
                        }, 1000);
                    }
                }
            }
        } catch (err: unknown) {
            setUploading(false);

            handleCustomError(err);

            // Delete image from cloudinary
            if (publicId) {
                await deleteImageFromCloudinary(publicId as string);
            }
        }
    };

    // Open and close camera
    useEffect(() => {
        // Clear states
        setBlob(null);
        setImage("");
        setUploading(false);

        // Clear video ref
        if (videoRef.current) videoRef.current.srcObject = null;

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
                        {message} and note that you can only click once.
                    </DialogDescription>
                </DialogHeader>

                {/* Camera */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-2xl shadow-custom border-2 border-white dark:border-zinc-700">
                        {/* video element */}
                        {!image && (
                            <div className="relative overflow-hidden">
                                {videoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted dark:bg-sidebar-backgroundDark rounded-[14px] z-10">
                                        <Loader2 className="h-7 w-7 animate-spin text-foreground" />
                                    </div>
                                )}

                                <div className="relative rounded-[15px] overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className={`w-full h-[300px] transform scale-x-[-1] object-cover`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Clicked image */}
                        {image && (
                            <div className="rounded-[15px] overflow-hidden">
                                <img
                                    className="w-full h-[300px] object-cover"
                                    src={image}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>

                    <div className="relative cursor-not-allowed flex items-center gap-2">
                        <Button
                            onClick={() =>
                                captureImageFromVideo(videoRef.current as HTMLVideoElement)
                            }
                            variant="default"
                            type="button"
                            disabled={uploading || image !== ""}
                            className="h-11 w-full shadow-md disabled:cursor-not-allowed"
                        >
                            Capture
                        </Button>

                        <Button
                            onClick={sendSnapshot}
                            variant="default"
                            type="button"
                            disabled={uploading || !blob}
                            className="h-11 w-full shadow-md disabled:cursor-not-allowed"
                        >
                            {uploading ? (
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
