import { NotificationModel, NotificationStatus, NotificationType } from './notification.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'user/user.model';
import { UpdateNotificationStatusInputDto } from 'notification/dto/inputs/update-status.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel('Notification')
        private readonly notificationModel: Model<NotificationModel>,
        @InjectModel('User')
        private readonly userModel: Model<User>,
    ) { }

    async updateNotificationStatus(notificationId: string, input: UpdateNotificationStatusInputDto): Promise<NotificationModel | null> {
        const updatedNotification = await this.notificationModel.findByIdAndUpdate(notificationId, {
            ...input
        }, { new: true });

        if (!updatedNotification) {
            throw new Error('Notification not found');
        }

        if (updatedNotification.read && updatedNotification.type === NotificationType.FAMILY_REQUEST && updatedNotification.status === NotificationStatus.ACCEPTED) {
            const userId = updatedNotification.createdBy;

            // Update the user's familyIds
            await this.userModel.findByIdAndUpdate(userId, {
                $addToSet: { familyIds: updatedNotification.familyId }
            });
        }

        return updatedNotification;
    }

    async getFamilyUnreadNotifications(familyId: string): Promise<NotificationModel[]> {
        return this.notificationModel.find({
            familyId: familyId,
            read: false,
        }).exec();
    }
}
