import { nameRegex, week } from "@/constants/regex";
import z from "zod";

// Schedule review form validation schema
export const formSchema = z.object({
    title: z
        .string()
        .trim()
        .regex(nameRegex.alphabet, "Title should contain only alphabets !")
        .nonempty("Title is required !"),
    week: z
        .string()
        // .regex(week.capitalLetter, "Week's first letter should be capital !")
        .regex(week.weekName, "Enter a valid week (eg:week 1) !")
        .nonempty("Week is required !"),
    batch: z
        .string({
            required_error: "Batch is required!",
        })
        .min(1, "Batch is required !"),
    student: z
        .string({
            required_error: "Student is required!",
        })
        .min(1, "Student is required !"),
    date: z.any().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a valid date !",
    }),
    time: z
        .string({
            required_error: "Time is required!",
        })
        .min(1, "Time is required!"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
