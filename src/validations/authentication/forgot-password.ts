import { emailRegex } from "@/constants/regex";
import z from "zod";

// Forgot password form validation schema
export const formSchema = z.object({
    email: z
        .string()
        .email("Invalid email address !")
        .regex(emailRegex.validEmail, "Enter a valid email (eg:user@gmail.com) !")
        .nonempty("Email is required !"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
