import z from "zod";

// Login form validation schema
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const formSchema = z.object({
    email: z
        .string()
        .email("Invalid email address!")
        .nonempty("Email is required!")
        .regex(emailRegex, "Enter a valid email (eg:user@gmail.com)"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters!")
        .nonempty("Password is required!"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
