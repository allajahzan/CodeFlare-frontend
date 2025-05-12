import { week } from "@/constants/regex";
import z from "zod";

// Week form validation schema
export const formSchemaWeek = z.object({
    name: z
        .string()
        .regex(week.capitalLetter, "First letter should be capiital !")
        .regex(week.weekName, "Enter a valid batch name (eg:Week 1) !"),
});

// Form type based on schema
export type FormTypeWeek = z.infer<typeof formSchemaWeek>;
