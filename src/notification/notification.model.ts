import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Schema, Document } from 'mongoose';

export enum NotificationType {
    FAMILY_REQUEST = "FAMILY_REQUEST"
}

export enum NotificationStatus {
    ACCEPTED = "ACCEPTED",
    DENIED = "DENIED",
    WAITING = "WAITING"
}

export class NotificationModel extends Document {
    @ApiProperty({ description: 'notification id' })
    id?: string;

    @ApiProperty({ description: 'Notification Type', enum: NotificationType })
    type!: NotificationType;

    @ApiProperty({ description: 'Created By User ID', type: String, required: false })
    createdBy?: string;

    @ApiProperty({ description: 'Created By User ID', type: String, required: false })
    createdFor?: string;

    @ApiProperty({ description: 'Associated Family ID', type: String })
    familyId!: string;

    @ApiProperty({ description: 'Notification Status', enum: NotificationStatus, required: false })
    status?: NotificationStatus;

    @ApiProperty({ description: 'Notification Read Status', type: Boolean })
    read!: boolean;
}


export const NotificationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationType)
    },
    createdBy: { type: ObjectId, required: false },
    createdFor: { type: ObjectId, required: false },
    familyId: { type: ObjectId, required: true },
    status: {
        type: String,
        required: false,
        enum: Object.values(NotificationStatus)
    },
    read: { type: Boolean, required: true }
});
