import { nameRegex, week } from "@/constants/regex";
import z from "zod";

// Schedule review form validation schema
export const formSchema = z.object({
    title: z
        .string()
        .regex(nameRegex.alphabet, "Title should contain only alphabets !")
        .nonempty("Title is required !"),
    week: z
        .string()
        .regex(week.capitalLetter, "Week's first letter should be capital !")
        .regex(week.weekName, "Enter a valid week (eg:Week 1) !")
        .nonempty("Week is required !"),
    batch: z.string().nonempty("Batch is required !"),
    student: z.string().nonempty("Student is required !"),
    date: z.string().nonempty("Date is required !"),
    time: z.string().nonempty("Time is required !"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
