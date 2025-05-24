import z from "zod";

// Update review form validation schema
export const formSchema = z.object({
    category: z.string().nonempty("Category is required !"),
    week: z.string().optional(),
    title: z.string().nonempty("Title is required !"),
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
