import { emailRegex } from "@/constants/regex";
import z from "zod";

// Forgot password form validation schema
export const formSchema = z.object({
    email: z
        .string()
        .email("Invalid email address !")
        .nonempty("Email is required !")
        .regex(emailRegex, "Enter a valid email (eg:user@gmail.com) !")
        .regex(emailRegex),
});

// Form type based on shema
export type FormType = z.infer<typeof formSchema>;
