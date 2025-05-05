import { emailRegex, nameRegex } from "@/constants/regex";
import z from "zod";

export const formSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters !")
            .regex(nameRegex.capitalLetter, "Name's first letter should be capital !")
            .regex(nameRegex.alphabet, "Name should contain only alphabets !")
            .nonempty("Name is required !"),
        email: z
            .string()
            .email("Invalid email address !")
            .regex(emailRegex.validEmail, "Enter a valid email !")
            .nonempty("Email is required !"),
        confirmEmail: z.string().nonempty("Confirm Email is required !"),
        role: z.string().nonempty("Role is required !"),
        batches: z.string().optional(), 
        message: z.string().optional(),
    })
    .refine((data) => data.email === data.confirmEmail, {
        path: ["confirmEmail"],
        message: "Email address do not match !",
    })
    .superRefine((data, ctx) => {
        if (
            data.role === "coordinator" &&
            (!data.batches || data.batches.trim() === "")
        ) {
            ctx.addIssue({
                path: ["batches"],
                code: z.ZodIssueCode.custom,
                message: "Batches are required for coordinators!",
            });
        }
    });

export type FormType = z.infer<typeof formSchema>;
