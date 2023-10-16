import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ZodInterceptor } from 'interceptors/zod.interceptor';
import { ZodPipe } from 'pipes/zod.pipe';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';
import { NotificationModel } from './notification.model';
import { NotificationService } from 'notification/notification.service';
import { UpdateNotificationStatusInputDto, UpdateNotificationStatusInputSchema } from 'notification/dto/inputs/update-status.dto';
import { GetNotificationSchema } from 'notification/dto/models/get-notification.dto';
import { GetUser } from 'decorators/user.decorators';
import { User } from 'user/user.model';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    @UseGuards(AuthGuard())
    @Patch('update/:notificationId')
    @ApiParam({ name: 'notificationId', type: String })
    @ApiBody({ type: UpdateNotificationStatusInputDto, description: 'update notification status input' })
    @ApiResponse({
        status: 200,
        description: 'update notification status',
        type: NotificationModel
    })
    @UseInterceptors(new ZodInterceptor(GetNotificationSchema))
    updateNotificationStatus(@Param('notificationId') notificationId: string, @Body(new ZodPipe(UpdateNotificationStatusInputSchema)) input: UpdateNotificationStatusInputDto): Promise<NotificationModel | null> {
        return this.notificationService.updateNotificationStatus(notificationId, input);
    }

    @UseGuards(AuthGuard())
    @Get('/family/:familyId')
    @ApiParam({ name: 'familyId', type: String })
    @ApiResponse({
        status: 200,
        description: 'get family Notifications',
        type: NotificationModel
    })
    @UseInterceptors(new ZodInterceptor(z.array(GetNotificationSchema)))
    getFamilyNotifications(@Param('familyId') familyId: string): Promise<NotificationModel[]> {
        return this.notificationService.getFamilyUnreadNotifications(familyId);
    }

    @UseGuards(AuthGuard())
    @Get('/user')
    @ApiResponse({
        status: 200,
        description: 'get user Notifications',
        type: NotificationModel
    })
    @UseInterceptors(new ZodInterceptor(z.array(GetNotificationSchema)))
    getUserNotifications(@GetUser() user: User): Promise<NotificationModel[]> {
        return this.notificationService.getUserUnreadNotifications(user.id);
    }

}
