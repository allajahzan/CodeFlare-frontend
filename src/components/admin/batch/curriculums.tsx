import CurriculumListSide from "./curriculum-list-side";
import CurriculumDetailsSide from "./curriculum-details-side";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { IBatch, IDomain, IWeek } from "@codeflare/common";

// Interface for Props
interface PropsType {
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Batches Component
function Curriculums({ setDrawerOpen }: PropsType) {
    const [selectedItem, setSelectedItem] = useState<IBatch | IWeek | IDomain | null>(null);

    // Small screen
    const isSmall = useMediaQuery("(max-width: 767.20px)");

    return (
        <div className="p-5 pt-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Left side */}
            <CurriculumListSide
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                setDrawerOpen={setDrawerOpen}
            />

            {/* Right side */}
            {!isSmall && (
                <CurriculumDetailsSide
                    selectedItem={selectedItem}
                />
            )}
        </div>
    );
}

export default Curriculums;
