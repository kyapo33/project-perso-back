import { z } from "zod";

export const customDateSchema = z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
    path: ['birthdate']
});