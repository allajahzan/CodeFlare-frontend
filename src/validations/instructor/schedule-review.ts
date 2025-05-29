// import { nameRegex } from "@/constants/regex";
import z from "zod";

// Schedule review form validation schema
export const formSchema = z.object({
    category: z.string().nonempty("Category is required !"),
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
    domain: z.string().optional(),
    week: z.string().optional(),
    weekName: z.string().nonempty("Week is required !"),
    title: z.string().nonempty("Title is required !"),
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
