import { nameRegex } from "@/constants/regex";
import z from "zod";

// Schedule review form validation schema
export const formSchema = z.object({
    title: z
        .string()
        .trim()
        .regex(nameRegex.alphabet, "Title should contain only alphabets !")
        .nonempty("Title is required !"),
    week: z.string().nonempty("Week is required !"),
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
    date: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
            message: "Please select a valid date !",
        })
        .refine((val) => val > new Date(), {
            message: "Please select a future date !",
        }),
    time: z
        .string({
            required_error: "Time is required!",
        })
        .min(1, "Time is required!"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
