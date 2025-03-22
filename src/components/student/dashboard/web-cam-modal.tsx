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
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-[300px] object-cover rounded-lg border"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default WebCamModal;
