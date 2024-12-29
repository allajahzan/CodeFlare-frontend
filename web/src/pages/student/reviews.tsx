import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PendingsAndChart,
  ReviewDetails,
} from "@/components/animated/reviewDetails/reviewDetails";

export interface Review {
  id: number;
  week: number;
  title: string;
  date: string;
  status: "Pass" | "Fail";
  instructor: "Ahsan allaj pk";
  details: string;
  pendings: string[];
}
const reviews: Review[] = [
  {
    id: 1,
    week: 1,
    title: "Javascript",
    date: "20th Jun 2024",
    status: "Pass",
    instructor: "Ahsan allaj pk",
    details:
      "Successfully completed all tasks for Week 1. Demonstrated excellent problem-solving skills and attention to detail.",
    pendings: ["data", "data", "data"],
  },
  {
    id: 2,
    week: 2,
    title: "MongoDB",
    date: "27th Jun 2024",
    status: "Fail",
    instructor: "Ahsan allaj pk",
    details:
      "Need improvement in project management skills. Time management and task prioritization require attention.",
    pendings: ["data", "data", "data"],
  },
  {
    id: 3,
    week: 3,
    title: "Full Domain",
    date: "4th Jul 2024",
    status: "Pass",
    instructor: "Ahsan allaj pk",
    details:
      "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    pendings: ["data", "data", "data"],
  },
  {
    id: 4,
    week: 4,
    title: "Full Domain",
    date: "4th Jul 2024",
    status: "Pass",
    instructor: "Ahsan allaj pk",
    details:
      "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    pendings: ["data", "data", "data"],
  },
];


function Reviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(
    reviews[reviews.length - 1]
  );

  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-5">
      {/* reviews lists */}
      <div
        className="sticky top-[20px] w-full flex flex-col gap-[30px] overflow-auto no-scrollbar
            h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] mb-5 md:mb-0"
      >
        {reviews.reverse().map((review, index) => (
          <div key={review.id} className="relative rounded-full">
            {/* one list */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={cn(
                "p-3 flex items-center gap-4 cursor-pointer rounded-full",
                selectedReview?.id === review.id ? "bg-zinc-100" : ""
              )}
              onClick={() => setSelectedReview(review)}
            >
              <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-custom bg-white">
                {review.status === "Pass" ? (
                  <CheckCircle size={24} className="text-green-900" />
                ) : (
                  <XCircle size={24} className="text-red-900" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Week {review.week}</p>
                <p className="text-muted-foreground text-sm">{review.date}</p>
              </div>
              <ChevronRight className="ml-auto" size={20} />
            </motion.div>

            {/* line */}
            {index < reviews.length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 54 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                style={{ top: "60px" }}
                className={cn(
                  "absolute left-9 w-0.5 -translate-x-1/2 rounded-full",
                  reviews[index + 1].status === "Pass"
                    ? "bg-green-900"
                    : "bg-red-900"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full h-full relative z-20 bg-white grid grid-rows-[auto_1fr] col-span-2 gap-5">
        {/* review details */}
        <ReviewDetails selectedReview={selectedReview as Review} />

        {/* pendings and performance status */}
        <PendingsAndChart selectedReview={selectedReview as Review} />
      </div>
    </div>
  );
}

export default Reviews;
