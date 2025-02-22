import BatchesListSide from "./batches-list-side";
import BatchesDetailsSide from "./batches-details-side";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// Interface for batch
export interface IBatch {
    _id: string;
    name: string;
}

// Interface for Props
interface PropsType {
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Batches Component
function Batches({setDrawerOpen}:PropsType) {
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side */}
            <BatchesListSide
                setSelectedBatch={setSelectedBatch}
                selectedBatch={selectedBatch}
                setDrawerOpen={setDrawerOpen}
            />

            {/* Right side */}
            {!isSmall && <BatchesDetailsSide selectedBatch={selectedBatch} />}
        </div>
    );
}

export default Batches;
