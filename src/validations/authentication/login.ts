import { emailRegex } from "@/constants/regex";
import z from "zod";

// Login form validation schema
export const formSchema = z.object({
    email: z
        .string()
        .email("Invalid email address !")
        .regex(emailRegex.validEmail, "Enter a valid email !")
        .nonempty("Email is required !"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters !")
        .nonempty("Password is required !"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
