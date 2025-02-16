import z from "zod";

// Add social links form validation schema
export const formSchema = z
    .object({
        portfolio: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value && value.trim() !== ""),
        { path: ["github"], message: "Github link is required !" }
    );

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
