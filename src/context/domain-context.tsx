import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ChevronLeft,
    GraduationCap,
    Loader2,
    Plus,
    Search,
    Text,
} from "lucide-react";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { IUser, IUserContext, UserContext } from "./user-context";
import { handleCustomError } from "@/utils/error";
import { fetchData, patchData, postData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { IDomain, IDomainsWeek } from "@codeflare/common";
import { cn } from "@/lib/utils";
import NotFoundYet from "@/components/common/fallback/not-found-text";
import { motion } from "framer-motion";
import IconButton from "@/components/ui/icon-button";
import CardHeader from "@/components/common/data-toolbar/header";
import { Button } from "@/components/ui/button";
import NotFoundOrbit from "@/components/common/fallback/not-found-orbit";
import { toast } from "@/hooks/use-toast";

// Interface for Domain Context
interface IDomainContext {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Domain Context
const DomainContext = createContext<IDomainContext | null>(null);

// Custom domain hook
export const useDomain = () => {
    const context = useContext(DomainContext);
    if (!context)
        throw new Error("useDomain should be used within DomainProvider");

    return context;
};

// Domain context Provider
const DomainContextProvider = ({ children }: { children: ReactNode }) => {
    // Set domain modal
    const [open, setOpen] = useState<boolean>(false);
    const [fetching, setFetching] = useState<Boolean>(true);

    // Confirmation modal
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);

    // Domains
    const [domains, setDomains] = useState<IDomain[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<IDomain | null>(null);
    const [selectedWeek, setSelectedWeek] = useState<IDomainsWeek | null>(null);
    const [description, setDescrption] = useState<string>("");
    const [fetchingDescription, setFetchingDescription] = useState<boolean>(true);

    // User Context
    const { user, setUser } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Open domain modal
    useEffect(() => {
        if (
            user &&
            (user?.role === "student" || user?.role === "instructor") &&
            !user.domain
        ) {
            setOpen(true);
        }
    }, [user]);

    // Fetch domains
    useEffect(() => {
        const fetchDomains = async () => {
            setFetching(true);

            try {
                // Send request
                const resp = await fetchData(ApiEndpoints.DOMAIN_SEARCH, role);

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    setTimeout(() => {
                        // Set domain
                        setDomains(data);

                        setFetching(false);
                    }, 1000);
                }
            } catch (err: unknown) {
                setFetching(false);
                handleCustomError(err);
            }
        };

        !user?.domain && fetchDomains();
    }, []);

    // Gemini api for description
    useEffect(() => {
        const fetchDescription = async () => {
            setFetchingDescription(true);
            setDescrption("");

            const badgeWeek = /(badge|boarding|toi)/i;
            const planningWeek = /(First|Second|Project|Planning)/i;
            const foundation = /(foundation)/i;

            const isBadgeWeek = badgeWeek.test(selectedWeek?.title ?? "");
            const isPlanningWeek = planningWeek.test(selectedWeek?.title ?? "");
            const isFoundation = foundation.test(selectedWeek?.title ?? "");

            try {
                // Send request
                if (isBadgeWeek) {
                    setDescrption(
                        "Cover everything which you have learned in your stack, both practical and theory."
                    );

                    setFetchingDescription(false);
                } else if (isPlanningWeek) {
                    setDescrption(
                        "Plan your project. And make figma design, database diagram, API documentation and module listing with proper timeline."
                    );

                    setFetchingDescription(false);
                } else if (isFoundation) {
                    setDescrption(
                        "In foundation week, you have to cover Html, Css and the basics of your stack."
                    );

                    setFetchingDescription(false);
                } else {
                    const resp = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY
                        }`,
                        {
                            headers: { "Content-Type": "application/json" },
                            method: "POST",
                            body: JSON.stringify({
                                contents: [
                                    {
                                        parts: [
                                            {
                                                text: `what is ${selectedWeek?.title}? explain in 80 words?`,
                                            },
                                        ],
                                    },
                                ],
                            }),
                        }
                    );
                    const data = await resp.json();
                    // Success response
                    if (resp && resp.status === 200) {
                        // Set description
                        setDescrption(data?.candidates[0]?.content?.parts[0]?.text);
                        setFetchingDescription(false);
                    }
                }
            } catch (err: unknown) {
                setFetchingDescription(false);
                setDescrption("Description not found");
                handleCustomError(err);
            }
        };
        selectedWeek && fetchDescription();
    }, [selectedWeek]);

    // Selected week
    useLayoutEffect(() => {
        setSelectedWeek(
            (selectedDomain?.domainsWeeks?.[0] as IDomainsWeek) || null
        );
    }, [selectedDomain]);

    // Select domain
    const handleSelectDomain = async (domain: IDomain) => {
        try {
            setSubmiting(true);

            // Send request to schedule foundation review
            const foundationReviewPromise = await postData(
                ApiEndpoints.REVIEW + "/foundation",
                {
                    domainId: domain._id,
                    batchId: user?.batch?._id,
                    weekId: domain.domainsWeeks[0].week._id,
                },
                role
            );

            // Send request to select domain
            const selectDomainPromise = await patchData(
                ApiEndpoints.SELECT_DOMAIN,
                { domainId: domain._id },
                role
            );

            const [resp1, resp2] = await Promise.all([
                foundationReviewPromise,
                selectDomainPromise,
            ]);

            // Success response
            if (resp1 && resp2 && resp1.status === 200 && resp2.status === 200) {
                // Update user in context
                setUser((prevUser: IUser | null) => {
                    if (!prevUser) return null;
                    return {
                        ...prevUser,
                        ...(prevUser.role === "student" && {
                            week: domain.domainsWeeks[0].week,
                        }),
                        domain,
                    };
                });

                // Local storage
                const userData = JSON.parse(localStorage.getItem("user") as string);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...userData,
                        ...(userData.role === "student" && {
                            week: domain.domainsWeeks[0].week,
                        }),
                        domain,
                    })
                );

                toast({ title: "Domain selected successfully." });
                setSubmiting(false);
                setOpenConfirmation(false);
                setOpen(false);
            }
        } catch (err: unknown) {
            setSubmiting(false);
            handleCustomError(err);
        }
    };

    // Clear states
    useLayoutEffect(()=>{
        if(!open){
            setSelectedDomain(null);
            setSelectedWeek(null);
            setDescrption('');
        }
    }, [open])

    return (
        <DomainContext.Provider value={{ open, setOpen }}>
            {children}
            {/* Domain Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent aria-describedby={undefined} className="flex flex-col gap-10 max-w-xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <span>Select domain</span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Select your domain to get started. once you choose you can't
                            change it later.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Domains List */}
                    <div className="flex justify-center h-full overflow-hidden">
                        {domains.length > 0 ? (
                            selectedDomain ? (
                                <div className="w-full flex flex-col gap-3">
                                    {/* Heading */}
                                    <div className="flex items-center gap-1">
                                        <IconButton
                                            Icon={ChevronLeft}
                                            className="border-none shadow-none rounded-full p-2 cursor-pointer bg-transparent dark:hover:bg-muted"
                                            action={() => {
                                                setSelectedDomain(null);
                                                setDescrption("");
                                            }}
                                        />
                                        <CardHeader heading={selectedDomain.name} />
                                    </div>
                                    {/* List */}
                                    <div className="w-full h-full grid grid-cols-3 overflow-hidden">
                                        {/* Left side */}
                                        <div className="h-full flex flex-col col-span-1 border rounded-lg shadow-custom overflow-auto">
                                            {selectedDomain.domainsWeeks.map((week, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (!fetchingDescription) {
                                                            setSelectedWeek(week);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-2 p-3",
                                                        selectedWeek?.week._id === week.week._id &&
                                                        "bg-blue-600/10 border-l-4 border-l-blue-600",
                                                        fetchingDescription
                                                            ? "cursor-not-allowed"
                                                            : "cursor-pointer"
                                                    )}
                                                >
                                                    <p className="h-6 w-6 text-xs rounded-full bg-blue-600/40 text-white flex items-center justify-center">
                                                        {index + 1}
                                                    </p>
                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-foreground">
                                                            {week.week.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-sm font-medium">
                                                            {week.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Right side */}
                                        <div className="col-span-2 p-3 pt-0 ">
                                            {selectedWeek ? (
                                                <div>
                                                    <h2 className="font-bold text-lg mb-2 text-foreground">
                                                        {selectedWeek?.week.name} - {selectedWeek.title}
                                                    </h2>
                                                    {!fetchingDescription ? (
                                                        <p className="text-foreground font-medium">
                                                            {description}
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2 animate-pulse">
                                                            <div className="h-4 w-full bg-muted rounded-md"></div>
                                                            <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                                                            <div className="h-4 w-2/3 bg-muted rounded-md"></div>
                                                            <div className="h-4 w-1/2 bg-muted rounded-md"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <NotFoundYet
                                                    MainIcon={Text}
                                                    text="No description found"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Button */}
                                    <div onClick={() => setOpenConfirmation(true)}>
                                        <Button
                                            type="button"
                                            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
                                        >
                                            Select
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full w-full grid grid-cols-2 gap-5">
                                    {domains.map((domain, index) => {
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                                key={index}
                                                onClick={() => {
                                                    setSelectedDomain(domain);
                                                }}
                                                className="w-full h-20 flex flex-col gap-1 items-center justify-center bg-muted/80 hover:bg-muted dark:bg-sidebar dark:hover:bg-sidebar-backgroundDark rounded-lg cursor-pointer"
                                            >
                                                <GraduationCap className="w-5 h-5 text-foreground" />
                                                <p className="font-semibold text-foreground">
                                                    {domain.name}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            <NotFoundOrbit
                                MainIcon={GraduationCap}
                                SubIcon={fetching ? Search : Plus}
                                text={fetching ? "Fetching" : "No domains found"}
                                message={
                                    fetching
                                        ? "Please wait a moment"
                                        : "No domains are added by admin"
                                }
                                className="w-full"
                            />
                        )}
                    </div>

                    {/* Confirmation Modal */}
                    <Dialog open={openConfirmation} onOpenChange={setOpenConfirmation}>
                        <DialogContent className="flex flex-col gap-10 bg-background dark:bg-sidebar-background">
                            <DialogHeader>
                                <DialogTitle className="text-foreground flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <GraduationCap className="w-4 h-4 text-foreground" />
                                    </div>
                                    <span>Are you sure you wanna select {selectedDomain?.name} ?</span>
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium">
                                    This operation can't be undone, so think before you confirm.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="w-full flex items-center justify-end gap-2">
                                <Button
                                    onClick={() => setOpenConfirmation(false)}
                                    type="button"
                                    className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleSelectDomain(selectedDomain as IDomain);
                                    }}
                                    disabled={submiting}
                                    className="h-11 w-full transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {submiting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Yes"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </DomainContext.Provider>
    );
};

export default DomainContextProvider;
