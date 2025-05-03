import CardHeader from "@/components/common/data-toolbar/header";
import ToolTip from "@/components/common/tooltip/tooltip";
import SmallIconButton from "@/components/ui/icon-button-small";
import { motion } from "framer-motion";
import {
    Briefcase,
    ChartNoAxesColumn,
    EllipsisVertical,
    GraduationCap,
    ListCheck,
    Medal,
    Share2,
} from "lucide-react";

// Over all information
function OverallInformation() {
    // Get week suffix
    const getSuffix = (week: number) => {
        if (week % 100 >= 11 && week % 100 <= 13) return week + "th";

        switch (week % 10) {
            case 1:
                return week + "st";
            case 2:
                return week + "nd";
            case 3:
                return week + "rd";
            default:
                return week + "th";
        }
    };

    return (
        <div className="relative w-full h-[400px] p-5 bg-background dark:bg-sidebar-background border rounded-2xl shadow-sm flex flex-col justify-between">
            {/* Header */}
            <CardHeader
                heading="Overall Information"
                children={
                    <div className="flex items-center gap-3">
                        {/* Dowload Icon */}
                        <ToolTip
                            text="Share"
                            side="left"
                            children={
                                <SmallIconButton Icon={Share2}/>
                            }
                        />

                        {/* Menu Icon */}
                        <ToolTip
                            text="Menu"
                            side="left"
                            children={
                                <SmallIconButton Icon={EllipsisVertical}/>
                            }
                        />
                    </div>
                }
            />

            {/* Week and batch */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Batch</p>
                    <p className="text-lg font-bold text-foreground">Batch 1</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium">Week</p>
                    <p className="text-lg font-bold text-foreground">{getSuffix(2)}</p>
                </div>
            </div>

            {/* Task and projects */}
            <div className="flex items-center justify-between">
                {/* Tasks */}
                <div className="flex items-center gap-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="p-5 rounded-full bg-muted shadow"
                    >
                        <ListCheck className="text-foreground" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <p className="text-3xl font-bold text-foreground">{2 * 3}</p>
                        <i className="text-sm text-start text-muted-foreground font-medium">
                            Tasks completed
                        </i>
                    </motion.div>
                </div>

                {/* <Separator orientation="vertical"  className="h-10" /> */}

                {/* Projects */}
                <div className="flex items-center gap-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="p-5 rounded-full bg-muted shadow"
                    >
                        <Briefcase className="text-foreground" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <p className="text-3xl font-bold text-foreground">0</p>
                        <i className="text-sm text-start text-muted-foreground font-medium">
                            Projects
                        </i>
                    </motion.div>
                </div>
            </div>

            {/* Divider */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="self-center h-[5px] bg-muted my-4 rounded-full"
            />

            {/* Weeks */}
            <div className="grid grid-cols-3 gap-3">
                {/* Projects */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-muted dark:bg-sidebar p-4 rounded-xl flex flex-col items-center justify-center gap-1"
                >
                    <GraduationCap className="w-5 h-5 text-foreground" />
                    <div className="flex items-center justify-center text-foreground text-base font-bold">
                        Mern
                    </div>
                    <i className="text-sm text-muted-foreground font-medium">Stack</i>
                </motion.div>

                {/* In Progress */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-muted dark:bg-sidebar p-4 rounded-xl flex flex-col items-center justify-center gap-1"
                >
                    <ChartNoAxesColumn className="w-5 h-5 text-foreground" />
                    <div className="flex items-center justify-center text-foreground text-base font-bold">
                        85%
                    </div>
                    <i className="text-sm text-muted-foreground font-medium">Progress </i>
                </motion.div>

                {/* Completed */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-muted dark:bg-sidebar p-4 rounded-xl flex flex-col items-center justify-center gap-1"
                >
                    <Medal className="w-5 h-5 text-foreground" />
                    <div className="flex items-center justify-center text-foreground text-base font-bold">
                        {getSuffix(2)}
                    </div>
                    <i className="text-sm text-muted-foreground font-medium">Rank</i>
                </motion.div>
            </div>
        </div>
    );
}

export default OverallInformation;
