import { motion } from "framer-motion";
import { Check, LucideProps } from "lucide-react";
import { Input } from "./input";
import { UseFormRegister } from "react-hook-form";
import { ReactNode } from "react";

// Interface for MultiSelectorContent
interface PropsMultiSelectorContent {
    handleSelect: (value: string) => void;
    dropDownOpen: boolean;
    values: string[];
    selectedBatches: string[];
}

// Multi Selector Content Component
function MultiSelectorContent({
    dropDownOpen,
    handleSelect,
    values,
    selectedBatches,
}: PropsMultiSelectorContent) {
    return (
        <div>
            {dropDownOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.1 }}
                    className="absolute z-10 max-h-[174px] top-[46px] w-full bg-white p-1 border rounded-md shadow-md overflow-y-auto no-scrollbar"
                >
                    {values?.map((value, index) => {
                        return (
                            // Lists
                            <div key={index} className="relative">
                                <p
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleSelect?.(value);
                                    }}
                                    className="p-2 py-[5.5px] font-medium hover:bg-muted rounded-sm"
                                >
                                    {value}
                                </p>
                                {/* Tick */}
                                {selectedBatches?.includes(value) && (
                                    <Check className="absolute right-1 top-1 w-4 h-4" />
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}

// Interface for TriggetMultiSelector
interface PropsTriggerMultiSelector {
    setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dropDownOpen: boolean;
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    register: UseFormRegister<any>;
    fieldName: string;
}

// Multi selector trigger Component
function TriggerMultiSelector({
    register,
    fieldName,
    setDropDownOpen,
    dropDownOpen,
    Icon,
}: PropsTriggerMultiSelector) {
    return (
        <div className="relative">
            <Input
                id={fieldName}
                type="text"
                placeholder={`Select ${fieldName}`}
                readOnly
                required
                autoComplete="off"
                {...register?.(fieldName as string)}
                onClick={(event) => {
                    event.stopPropagation();
                    setDropDownOpen?.(!dropDownOpen);
                }}
                className="font-medium p-5 pl-9 cursor-pointer"
            />
            {Icon && (
                <Icon className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
            )}
        </div>
    );
}

// Interface for MultiSelector
interface PropsMultiSelector {
    triggerMultiSelector: ReactNode;
    multiSelectorContent: ReactNode;
}

// Multi Selecter Component
function MultiSelector({
    multiSelectorContent,
    triggerMultiSelector,
}: PropsMultiSelector) {
    return (
        <div className="relative">
            {triggerMultiSelector}
            {multiSelectorContent}
        </div>
    );
}

export default MultiSelector;

export { TriggerMultiSelector, MultiSelectorContent, MultiSelector };
