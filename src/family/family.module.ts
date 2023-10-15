import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { FamilyController } from 'family/family.controller';
import { FamilySchema } from 'family/family.model';
import { FamilyService } from 'family/family.service';
import { NotificationSchema } from 'notification/notification.model';
import { UserSchema } from 'user/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Family', schema: FamilySchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
        AuthModule
    ],
    controllers: [FamilyController],
    providers: [FamilyService],
    exports: [
        FamilyService]
})
export class FamilyModule { }
