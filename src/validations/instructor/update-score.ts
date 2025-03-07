import { score } from "@/constants/regex";
import z from "zod";

// Update score form validation schema
export const formSchema = z.object({
    practical: z
        .string()
        .regex(score.digits, "Enter a valid practical score !")
        .regex(score.range, "Score should be between 0 and 10 !")
        .nonempty("Score is required !"),
    theory: z
        .string()
        .regex(score.digits, "Enter a valid theory score !")
        .regex(score.range, "Score should be between 0 and 10 !")
        .nonempty("Score is required !"),
    result: z.string().nonempty("Result is required !"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
