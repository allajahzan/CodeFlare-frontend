import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CalendarRange,
    GraduationCap,
    Loader2,
    Pencil,
    Plus,
    Text,
    X,
} from "lucide-react";
import { IBatch, IWeek, IDomain, IDomainsWeek } from "@codeflare/common";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { fetchData, updateData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { toast } from "@/hooks/use-toast";

// Interface for Props
interface PropsType {
    itemToEdit: IBatch | IWeek | IDomain;
    setItems: React.Dispatch<
        React.SetStateAction<IBatch[] | IWeek[] | IDomain[]>
    >;
    setSelectedItem: React.Dispatch<
        React.SetStateAction<IBatch | IWeek | IDomain | null>
    >;
}

// Edit domain modal Component
function EditDomainModal({ itemToEdit, setItems, setSelectedItem }: PropsType) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [weeksList, setWeeksList] = useState<IWeek[]>([]);
    const [domainName, setDomainName] = useState("");
    const [domainWeeks, setDomainWeeks] = useState<IDomainsWeek[]>([
        { week: { _id: "", name: "" }, title: "" },
    ]);

    // Scroll ref
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Add a new empty week entry
    const handleAddWeek = () => {
        setDomainWeeks((prev) => {
            const lastItem = prev[prev.length - 1];

            // Check if last field is filled
            if (!lastItem?.week || !lastItem?.title) {
                toast({ title: "Please fill all fields before add another week!" });
                return prev;
            }

            const updated = [...prev, { week: { _id: "", name: "" }, title: "" }];

            // Scroll after update is applied
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 0);

            return updated;
        });
    };

    // Remove a week entry
    const handleRemoveWeek = (index: number) => {
        setDomainWeeks(domainWeeks.filter((_, i) => i !== index));
    };

    // Update week or title
    const handleChange = (
        index: number,
        field: "week" | "title",
        value: string | IWeek
    ) => {
        let isAlreadyExists;
        if (field === "week") {
            // Check if week is already added
            isAlreadyExists = domainWeeks.some(
                (item) => item.week._id === (JSON.parse(value as string) as IWeek)._id
            );
        } else {
            // Check if title is already added
            isAlreadyExists = domainWeeks.some((item) => item.title === value);
        }

        // If true
        if (isAlreadyExists) {
            toast({ title: `This ${field} is already added!` });
            return;
        }

        const updated = [...domainWeeks];
        if (field === "title") {
            updated[index][field] = value as string;
        } else {
            updated[index][field] = JSON.parse(value as string) as IWeek;
        }
        setDomainWeeks(updated);
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = {
                name: domainName,
                weeks: domainWeeks,
            };

            // Send request
            const resp = await updateData(
                ApiEndpoints.DOMAIN + `/${(itemToEdit as IDomain)._id}`,
                data,
                role
            );

            if (resp && resp.status === 200) {
                const data = resp.data?.data;

                // Set items
                setItems((prev) => {
                    return prev.map((item) => {
                        if (item._id === (itemToEdit as IDomain)._id) {
                            return data;
                        } else {
                            return item;
                        }
                    });
                });

                // Update selected item if its selected
                setSelectedItem((item) => {
                    if (item && item._id === (itemToEdit as IDomain)._id) {
                        return data;
                    } else {
                        return item;
                    }
                });

                setOpen(false);

                toast({ title: "Domain updated successfully." });
            }
        } catch (err: unknown) {
            handleCustomError(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Reset domains weeks
    useEffect(() => {
        setDomainWeeks((itemToEdit as IDomain).domainsWeeks);
        setDomainName((itemToEdit as IDomain).name);
    }, [itemToEdit]);

    // Fetch weeks from backend
    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.WEEK, role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    setWeeksList(data);
                }
            } catch (err: unknown) {
                handleCustomError(err);
            }
        };

        fetchWeeks();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="p-2 rounded-full bg-foreground dark:bg-muted hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white shadow-md cursor-pointer">
                    <Pencil className="h-4 w-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-10 max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <span>Update domain</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Here you can update a domain and its weeks.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Domain Name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm text-foreground font-medium"
                        >
                            Domain Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"
                                tabIndex={-1}
                                required
                                autoComplete="off"
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value)}
                                placeholder={`Enter domain's name`}
                                className="text-foreground font-medium p-5 pl-9"
                            />
                            <GraduationCap className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </div>

                    {/* Week List */}
                    <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">
                            Weeks for this domain
                        </Label>

                        {/* Scrollable Week Fields */}
                        <div
                            ref={scrollRef}
                            className="max-h-[220px] overflow-y-auto no-scrollbar space-y-2"
                        >
                            {domainWeeks.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    {/* Week Dropdown */}
                                    <Select
                                        value={JSON.stringify(item.week)}
                                        onValueChange={(value) =>
                                            handleChange(index, "week", value)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="flex-1 relative border border-border p-5 pl-9 text-sm text-foreground bg-background">
                                            <span className="text-left w-full truncate">
                                                {item.week.name || "Select week"}
                                            </span>
                                            <CalendarRange className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[140px]">
                                            {weeksList.length > 0 ? (
                                                weeksList.map((week) => (
                                                    <SelectItem
                                                        key={week._id}
                                                        value={JSON.stringify(week)}
                                                    >
                                                        {week.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <p className="p-3 text-center text-sm text-foreground">
                                                    No weeks found
                                                </p>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {/* Week Title Input */}
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Enter title"
                                            value={item.title}
                                            onChange={(e) =>
                                                handleChange(index, "title", e.target.value)
                                            }
                                            required
                                            className="flex-1 text-foreground font-medium p-5 pl-9"
                                        />
                                        <Text className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                    </div>

                                    {/* Remove Button */}
                                    {domainWeeks.length > 1 &&
                                        !(itemToEdit as IDomain).domainsWeeks.includes(item) && (
                                            <div
                                                className="p-2 hover:bg-muted rounded-full duration-0 cursor-pointer"
                                                onClick={() => handleRemoveWeek(index)}
                                            >
                                                <X className="h-4 w-4 text-foreground" />
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>

                        {/* Add Week Button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full p-5 font-medium text-sm text-foreground bg-muted border-none"
                            onClick={handleAddWeek}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Week
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button type="submit" disabled={submitting} className="w-full h-11">
                            {submitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditDomainModal;
