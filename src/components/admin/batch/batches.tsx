import BatchesListSide from "./batches-list-side";
import BatchesDetailsSide from "./batches-details-side";
import { useState } from "react";

// Interface for batch
export interface IBatch {
    _id: string;
    name: string;
}

// Batches Component
function Batches() {
    const handleSelect = () => { };
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side */}
            <BatchesListSide setSelectedBatch={setSelectedBatch} />

            {/* Right side */}
            <BatchesDetailsSide
                handleSelect={handleSelect}
                selectedBatch={selectedBatch}
            />
        </div>
    );
}

export default Batches;
