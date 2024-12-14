import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "../common.css";

function Reviews() {
  interface Review {
    id: number;
    week: number;
    date: string;
    status: "pass" | "fail";
    details: string;
  }
  const reviews: Review[] = [
    {
      id: 1,
      week: 1,
      date: "20th Jun 2024",
      status: "pass",
      details:
        "Successfully completed all tasks for Week 1. Demonstrated excellent problem-solving skills and attention to detail.",
    },
    {
      id: 2,
      week: 2,
      date: "27th Jun 2024",
      status: "fail",
      details:
        "Need improvement in project management skills. Time management and task prioritization require attention.",
    },
    {
      id: 3,
      week: 3,
      date: "4th Jul 2024",
      status: "pass",
      details:
        "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    },
    {
      id: 4,
      week: 4,
      date: "11th Jul 2024",
      status: "pass",
      details:
        "Excellent teamwork and communication. Took initiative in leading a small project team.",
    },
    {
      id: 5,
      week: 3,
      date: "4th Jul 2024",
      status: "pass",
      details:
        "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    },
    {
      id: 6,
      week: 4,
      date: "11th Jul 2024",
      status: "pass",
      details:
        "Excellent teamwork and communication. Took initiative in leading a small project team.",
    },
    {
      id: 7,
      week: 3,
      date: "4th Jul 2024",
      status: "pass",
      details:
        "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    },
    {
      id: 8,
      week: 4,
      date: "11th Jul 2024",
      status: "pass",
      details:
        "Excellent teamwork and communication. Took initiative in leading a small project team.",
    },
    {
      id: 9,
      week: 3,
      date: "4th Jul 2024",
      status: "pass",
      details:
        "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    },
    {
      id: 10,
      week: 4,
      date: "11th Jul 2024",
      status: "pass",
      details:
        "Excellent teamwork and communication. Took initiative in leading a small project team.",
    },
  ];

  const [selectedReview, setSelectedReview] = useState<Review | null>(
    reviews[0]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg sticky top-[97px] z-50">Reviews</p>
        <div className="h-10"></div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          style={{ maxHeight: "calc(100vh - 290px)" }}
          className="relative p-3  flex flex-col gap-10 overflow-auto no-scrollbar rounded-2xl border-2 border-zinc-100"
        >
          {reviews.map((review, index) => (
            <div key={review.id} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-4 relative z-10 cursor-pointer p-3 rounded-2xl",
                  selectedReview?.id === review.id ? "bg-zinc-100" : ""
                )}
                onClick={() => setSelectedReview(review)}
              >
                <div className="h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-md">
                  {review.status === "pass" ? (
                    <CheckCircle size={24} className="text-green-700" />
                  ) : (
                    <XCircle size={24} className="text-red-700" />
                  )}
                </div>
                <div>
                  <p className="paragraph">
                    Week {review.week}
                  </p>
                  <p className="text-sm text-zinc-400 paragraph">
                    {review.date}
                  </p>
                </div>
                <ChevronRight className="ml-auto" size={20} />
              </motion.div>

              {/* line */}
              {index < reviews.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 61 }}
                  transition={{ delay: index * 0.1 }}
                  style={{top:'61px'}}
                  className={cn(
                    "absolute left-9 w-0.5 -translate-x-1/2 rounded-full",
                    review.status === "pass" ? "bg-black" : "bg-black"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* review details */}
        <div className="w-full p-5 rounded-2xl border-2 border-zinc-100">
          <AnimatePresence mode="wait">
            {selectedReview && (
              <motion.div
                key={selectedReview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="paragraph">Week {selectedReview.week}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
