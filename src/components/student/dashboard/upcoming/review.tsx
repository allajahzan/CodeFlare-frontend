import CardHeader from "@/components/common/data-toolbar/header";
import ToolTip from "@/components/common/tooltip/tooltip";
import IconButton from "@/components/ui/icon-button";
import SmallIconButton from "@/components/ui/icon-button-small";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    CalendarDays,
    CircleDashed,
    Dot,
    Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function UpcomingReview() {
    // Navigate
    const navigate = useNavigate();

    return (
        <div className="w-full p-5 flex flex-col gap-3 bg-background dark:bg-sidebar-background rounded-2xl border ">
            {/* Heading */}
            <CardHeader
                heading="Upcoming Review"
                children={
                    <ToolTip
                        text="Reviews"
                        side="left"
                        children={<SmallIconButton Icon={ArrowUpRight} />}
                        action={() => navigate("/student/review")}
                    />
                }
            />

            {/* List */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="p-2 flex items-center gap-4 cursor-pointer rounded-xl bg-muted dark:bg-sidebar hover:bg-muted dark:hover:bg-sidebar-backgroundDark"
            >
                {/* Icon circle */}
                <div className="h-12 w-12 rounded-full flex items-center justify-center">
                    <CircleDashed size={32} className="text-yellow-500" />
                </div>

                {/* Week and date */}
                <div className="flex-1 flex flex-col gap-0">
                    <p className="text-foreground font-semibold">Javascript - week 3</p>
                    <p className="flex gap-1 items-center text-sm text-muted-foreground font-medium truncate">
                        12:00 AM
                        <Dot />
                        <CalendarDays className="w-3 h-3" />
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                        })}
                    </p>
                    {/* <p className="font-medium text-foreground">Instructor - Ahsan allaj </p> */}
                </div>
                <IconButton
                    Icon={Video}
                    iconClassName="w-5 h-5"
                    className="border-none shadow-none rounded-full bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
                />
            </motion.div>
        </div>
    );
}

export default UpcomingReview;
