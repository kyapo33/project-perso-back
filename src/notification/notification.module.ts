import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { FamilySchema } from 'family/family.model';
import { NotificationController } from 'notification/notification.controller';
import { NotificationSchema } from 'notification/notification.model';
import { NotificationService } from 'notification/notification.service';
import { UserSchema } from 'user/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: 'Family', schema: FamilySchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        AuthModule
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [
        NotificationService]
})
export class NotificationModule { }
