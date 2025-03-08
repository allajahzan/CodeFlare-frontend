import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingsAndChart, ReviewDetails } from "./review-details";
import CardHeader from "@/components/common/data-card/header";
import SearchFilterSort from "@/components/common/data-card/search-filter-sort";
import { IReview } from "@/types/review";

// Interface for Review


// Reviews Component
function Reviews() {
    // Review related states
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(
        reviews[0]
    );

    return (
        <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-5 bg-transparent">
            {/* Reviews lists */}
            <div
                className="sticky top-[0px] w-full p-5 flex flex-col gap-5
            h-[calc(100vh-322px)] md:h-[calc(100vh-108px)] mb-5 md:mb-0 rounded-2xl
            border border-border dark:border-customBorder shadow-sm dark:shadow-customBorder dark:shadow-inner"
            >
                {/* Card header */}
                <CardHeader count={reviews.length} heading="All Reviews" />

                {/* Search filter sort */}
                <SearchFilterSort />

                <div className="flex flex-col gap-8 overflow-auto no-scrollbar">
                    {reviews.map((review, index) => (
                        <div key={review._id} className="relative rounded-lg">
                            {/* One list */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className={cn(
                                    "p-2 px-3 flex items-center gap-4 cursor-pointer rounded-lg bg-background hover:bg-muted dark:hover:bg-s_idebar border border-transparent dark:border-customBorder",
                                    selectedReview?._id === review._id
                                        ? "bg-muted dark:bg-sidebar"
                                        : ""
                                )}
                                onClick={() => setSelectedReview(review)}
                            >
                                {/* Icon circle */}
                                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-background border-2 border-white dark:border-border">
                                    {review.status === "Pass" ? (
                                        <CheckCircle size={24} className="text-green-700" />
                                    ) : (
                                        <XCircle size={24} className="text-red-700" />
                                    )}
                                </div>

                                {/* Week and date */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-foreground font-semibold">
                                        Week {review.week}
                                    </p>
                                    <p className="text-muted-foreground text-sm">{review.date.toDateString()}</p>
                                </div>
                                <ChevronRight className="ml-auto w-4 h-4 text-foreground" />
                            </motion.div>

                            {/* Line */}
                            {index < reviews.length - 1 && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 49 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    style={{ top: "57px" }}
                                    className={cn(
                                        "absolute z-50 left-[37px] w-0.5 -translate-x-1/2 rounded-full",
                                        reviews[index + 1].status === "Pass"
                                            ? "bg-green-700"
                                            : "bg-red-700"
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected review details */}
            <div className="w-full h-full relative z-20 bg-background rounded-2xl grid grid-rows-[auto_1fr] md:col-span-1 lg:col-span-2 gap-5 overflow-auto">
                {/* Review details */}
                <ReviewDetails selectedReview={selectedReview as IReview} />

                {/* Pendings and performance graph */}
                <PendingsAndChart selectedReview={selectedReview as IReview} />
            </div>
        </div>
    );
}

export default Reviews;
