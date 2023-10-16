import { z } from 'zod';

export const NotificationTypeSchema = z.enum([
    "FAMILY_REQUEST"
]);

export const NotificationStatusSchema = z.enum([
    "ACCEPTED",
    "DENIED"
]);

export const GetNotificationSchema = z.object({
    id: z.string(),
    type: NotificationTypeSchema,
    createdBy: z.any().optional(),
    createdFor: z.any().optional(),
    familyId: z.any(),
    status: NotificationStatusSchema.optional(),
    read: z.boolean(),
});
