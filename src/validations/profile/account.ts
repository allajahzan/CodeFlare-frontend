import { nameRegex } from "@/constants/regex";
import z from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters !")
        .regex(nameRegex.capitalLetter, "Name's first letter should be capital !")
        .regex(nameRegex.alphabet, "Name should contain only alphabets !")
        .nonempty("Name is required !"),
    phoneNumber: z
        .string()
        .length(10, "Phone number should have 10 digits !")
        .optional()
        .or(z.literal("")),
    bio: z
        .string()
        .optional()
        .refine((value) => !value || nameRegex.alphabet.test(value), {
            message: "Bio should contain only alphabets!",
        }),
    about: z.string().max(100, "Maximum 100 letters !"),
    softSkills: z.string().optional(),
    techSkills: z.string().optional(),
    work: z.string().optional(),
    education: z.string().optional(),
});

// Formtype based on schema
export type Formtype = z.infer<typeof formSchema>;
