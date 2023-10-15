import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatusSchema } from 'notification/dto/models/get-notification.dto';
import { NotificationStatus } from 'notification/notification.model';
import { z } from 'zod';

export const UpdateNotificationStatusInputSchema = z.object({
    status: NotificationStatusSchema.optional(),
    read: z.boolean().optional()
});

export class UpdateNotificationStatusInputDto {
    @ApiProperty({ description: 'Notification Status', enum: NotificationStatus })
    status?: NotificationStatus;
    read?: boolean;
}