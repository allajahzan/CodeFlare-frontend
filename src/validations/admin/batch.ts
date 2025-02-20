import { batch } from "@/constants/regex";
import z from "zod";

// Batch form validation schema
export const formSchema = z.object({
    name: z
        .string()
        .regex(batch.capitalLetter, "First letter should be capiital !")
        .regex(batch.batchName, "Enter a valid batch name (eg:Batch 1) !"),
});

// Form type based on schema
export type FormType = z.infer<typeof formSchema>;
