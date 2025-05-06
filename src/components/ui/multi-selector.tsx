import { motion } from "framer-motion";
import { Check, LucideProps } from "lucide-react";
import { Input } from "./input";
import { UseFormRegister } from "react-hook-form";
import { ReactNode } from "react";
import { IBatch } from "@codeflare/common";

// Interface for MultiSelectorContent
interface PropsMultiSelectorContent {
    handleSelect: (value: IBatch) => void;
    dropDownOpen: boolean;
    values: IBatch[];
    selectedBatches: IBatch[];
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
                    className="absolute z-10 max-h-[108px] top-[46px] w-full bg-popover p-1 border rounded-md shadow-md overflow-y-auto"
                >
                    {values.length > 0 &&
                        values?.map((value, index) => {
                            const isSelected = selectedBatches.some(
                                (batch) => batch._id === value._id
                            );

                            return (
                                // Lists
                                <div
                                    key={value._id || index}
                                    className="relative cursor-pointer"
                                >
                                    <p
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleSelect?.(value);
                                        }}
                                        className="p-2 py-[5.5px] text-popover-foreground font-medium hover:bg-muted rounded-sm"
                                    >
                                        {value.name}
                                    </p>
                                    {/* Tick */}
                                    {isSelected && (
                                        <Check className="absolute right-1 top-1 w-4 h-4 text-foreground" />
                                    )}
                                </div>
                            );
                        })}

                    {values.length === 0 && (
                        <p className="p-2 py-[5.5px] text-sm text-foreground font-medium">
                            No available batches
                        </p>
                    )}
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
                onKeyDown={(event) => event.preventDefault()}
                className="text-foreground font-medium p-5 pl-9 cursor-pointer placeholder:text-muted-foreground"
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
