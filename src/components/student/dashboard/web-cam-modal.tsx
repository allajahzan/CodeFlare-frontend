import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScanFace } from "lucide-react";

// Interface for Porps
interface Propstype {
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    webCamOpen: boolean;
    setWebCamOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// WebCam Modal Component
function WebCamModal({ videoRef, webCamOpen, setWebCamOpen }: Propstype) {
     // Open webcam to scan face
        // useEffect(() => {
        //     let stream: MediaStream | null = null;
    
        //     // Start Webcam
        //     const startWebcam = async () => {
        //         try {
        //             stream = await navigator.mediaDevices.getUserMedia({ video: true });
        //             if (videoRef.current) {
        //                 videoRef.current.srcObject = stream;
        //             }
        //             await loadModels(); // Load models
        //         } catch (err: unknown) {
        //             console.log(err);
        //         }
        //     };
    
        //     // Stop Webcam
        //     const stopWebcam = () => {
        //         if (stream) {
        //             stream.getTracks().forEach((track) => track.stop());
        //         }
        //         if (videoRef.current) {
        //             videoRef.current.srcObject = null;
        //         }
        //     };
    
        //     if (webCamOpen) {
        //         startWebcam();
        //     } else {
        //         stopWebcam();
        //     }
    
        //     return () => stopWebcam(); // Clean up
        // }, [webCamOpen]);
    
        // // Load models
        // const loadModels = async () => {
        //     await tf.setBackend("webgl");
        //     await tf.ready();
    
        //     // Wait till tansorflow connect
        //     await new Promise((resolve) => setTimeout(resolve, 500));
    
        //     await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        //     await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        //     await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        //     startFaceRecognition();
        // };
    
        // // Scanner
        // const startFaceRecognition = async () => {
        //     if (!videoRef.current) return;
    
        //     setTimeout(async () => {
        //         const detections = await faceapi
        //             .detectSingleFace(
        //                 videoRef.current as HTMLVideoElement,
        //                 new faceapi.TinyFaceDetectorOptions()
        //             )
        //             .withFaceLandmarks()
        //             .withFaceDescriptor();
    
        //         if (detections) {
        //             const faceDescriptor = detections.descriptor; // 128-dimensional vector
        //             const uniqueId = await generateStableFaceId(faceDescriptor);
        //             console.log("Unique Face ID:", uniqueId);
        //         }
        //     }, 3000);
        // };
        
    return (
        <Dialog open={webCamOpen} onOpenChange={setWebCamOpen}>
            <DialogContent className="flex flex-col gap-10">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <ScanFace className="w-4 h-4" />
                        </div>
                        <span>Face detector</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Ensure secure check-ins and check-outs with facial recognition.
                    </DialogDescription>
                </DialogHeader>

                {/* Camera */}
                <div className="p-3 border rounded-2xl">
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-[300px] object-cover rounded-lg border"
                        />
                        <canvas
                            id="overlayCanvas"
                            className="absolute z-50 h-full w-full inset-0"
                        ></canvas>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default WebCamModal;
