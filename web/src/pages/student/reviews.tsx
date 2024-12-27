import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronRight, Copy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import LineCharts from "@/components/Charts/LineChart";

interface Review {
  id: number;
  week: number;
  title: string;
  date: string;
  status: "Pass" | "Fail";
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
    details:
      "Showed significant progress in coding skills. Implemented complex features with minimal guidance.",
    pendings: ["data", "data", "data"],
  },
];

const monthlyData = [
  { week: "1", score: 9 },
  { week: "2", score: 15 },
  { week: "3", score: 0 },
  { week: "5", score: 20 },
  { week: "6", score: 10 },
  { week: "7", score: 12 },
  { week: "8", score: 0 },
  { week: "9", score: 20 },
  { week: "10", score: 10 },
  { week: "11", score: 12 },
  { week: "12", score: 0 },
];

function Reviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(
    reviews[reviews.length - 1]
  );

  const { toast } = useToast();

  // copy to clipboard
  const handleCopy = useCallback(
    async (texts: string[]) => {
      try {
        await navigator.clipboard.writeText(texts.toString());
        toast({ title: "Pendings copied to clipboard" });
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast({ title: "Failed to copy to clipboard" });
      }
    },
    [toast]
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
              transition={{ delay: index * 0.1 }}
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
                <p className="text-zinc-400 text-sm">{review.date}</p>
              </div>
              <ChevronRight className="ml-auto" size={20} />
            </motion.div>

            {/* line */}
            {index < reviews.length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 54 }}
                transition={{ delay: index * 0.1 }}
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

      <div className="w-full h-full relative z-20 bg-white grid grid-rows-3 col-span-2 gap-5 rounded-2xl">
        {/* review details */}
        <div className="h-full p-8 rounded-2xl shadow-custom overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedReview && (
              <motion.div
                key={selectedReview.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg">
                      Week {selectedReview.week}
                    </p>
                    <Badge
                      className={cn(
                        "text-sm font-semibold",
                        selectedReview.status === "Pass"
                          ? "text-green-900"
                          : "text-red-900"
                      )}
                      variant="secondary"
                    >
                      {selectedReview.status}
                    </Badge>
                  </div>
                  <p className="text-zinc-400 text-sm">{selectedReview.date}</p>
                  <p className="font-medium truncate">
                    {selectedReview.details}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* pendings and performance status */}
        <div className="h-fit grid grid-cols-1 sm:grid-cols-2 row-span-2 gap-5">
          {/* pendings */}
          <div className="p-8 bg-zinc-0 rounded-2xl shadow-custom">
            <AnimatePresence mode="wait">
              {selectedReview && (
                <motion.div
                  className="h-full w-full flex flex-col gap-7"
                  key={selectedReview.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between relative">
                    <p className="text-base font-medium truncate">
                      Pendings ({selectedReview.title})
                    </p>
                    <div
                      onClick={() => handleCopy(selectedReview.pendings)}
                      className="p-3 absolute -right-4 -top-2.5 bg-white active:bg-zinc-100 rounded-lg cursor-pointer"
                    >
                      <Copy className="w-5 h-5" />
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <div className="h-[170px] sm:h-[266px] flex flex-col gap-2 overflow-auto no-scrolbar">
                      {selectedReview.pendings.map((item, index) => {
                        return (
                          <p key={index} className="font-medium">
                            {item}
                          </p>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* chart for monthly performance*/}
          <div className="p-8 bg-zinc-0 rounded-2xl shadow-custom h-full">
            <LineCharts data={monthlyData} text="Weekly Performance" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
