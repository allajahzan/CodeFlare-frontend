import { nameRegex } from "@/constants/regex";
import z from "zod";

// Update review form validation schema
export const formSchema = z.object({
    title: z
        .string()
        .trim()
        .regex(nameRegex.alphabet, "Title should contain only alphabets !")
        .nonempty("Title is required !"),
    week: z.string().nonempty("Week is required !"),
    date: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
            message: "Please select a valid date !",
        })
        .refine(
            (val) => {
                const date = new Date(val);
                return date.getTime() >= new Date().setHours(0, 0, 0, 0);
            },
            {
                message: "Please select a future date !",
            }
        ),
    time: z
        .string({
            required_error: "Time is required!",
        })
        .min(1, "Time is required!"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
