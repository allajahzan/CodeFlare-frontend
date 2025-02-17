import { emailRegex, nameRegex } from "@/constants/regex";
import z from "zod";

// User form validation schema
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
            .regex(emailRegex.validEmail, "Enter a valid email (eg:user@gmail.com) !")
            .nonempty("Email is required !"),
        confirmEmail: z.string().nonempty("confirm Email is required !"),
        role: z.string().nonempty("Role is required !"),
        batches: z.string().nonempty("Batches are required !"),
        message: z.string().optional(),
    })
    .refine((formData) => formData.email === formData.confirmEmail, {
        path: ["confirmEmail"],
        message: "Email address do not match !",
    });

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
