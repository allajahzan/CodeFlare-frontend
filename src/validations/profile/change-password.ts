import { passwordRegex } from "@/constants/regex";
import z from "zod";

// Change passord form validation schema
export const formSchema = z
    .object({
        currentPassword: z.string().nonempty("Current password is required !"),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters !")
            .regex(
                passwordRegex.capitalLetter,
                "Password should contain at least 1 capital letter !"
            )
            .regex(passwordRegex.digit, "Password should contain at least 1 digit !")
            .regex(
                passwordRegex.specialSymbol,
                "Password should contain at least 1 special symbol !"
            )
            .nonempty("New password is required !"),
        confirmPassword: z.string(),
    })
    .refine((formData) => formData.newPassword === formData.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match !",
    });

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
