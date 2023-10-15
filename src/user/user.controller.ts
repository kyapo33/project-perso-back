import { Body, Controller, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserSchema, GetUserModelDto } from 'user/dto/models/get-user.dto';
import { ZodInterceptor } from 'interceptors/zod.interceptor';
import { GetUser } from 'decorators/user.decorators';
import { User } from 'user/user.model';
import { UserService } from 'user/user.service';
import { ZodPipe } from 'pipes/zod.pipe';
import { UpdateUserInputDto, UpdateUserInputSchema } from 'user/dto/inputs/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';
import { GetUserProfileByFamilyDto, GetUserProfileByFamilySchema } from 'user/dto/models/get-user-profile-by-family';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard())
    @Get('/profile')
    @ApiResponse({
        status: 200,
        description: 'get the current user',
        type: GetUserModelDto
    })
    @UseInterceptors(new ZodInterceptor(GetUserSchema))
    getUserProfile(@GetUser() user: User): GetUserModelDto {
        return user;
    }

    @UseGuards(AuthGuard())
    @Patch('/update/:userId')
    @ApiParam({ name: 'userId', type: String })
    @ApiBody({ type: UpdateUserInputDto, description: 'update a user input' })
    @ApiResponse({
        status: 200,
        description: 'update a user',
        type: GetUserModelDto
    })
    @UseInterceptors(new ZodInterceptor(GetUserSchema))
    updateUser(@Param('userId') userId: string, @Body(new ZodPipe(UpdateUserInputSchema)) updateUserInput: UpdateUserInputDto): Promise<GetUserModelDto | null> {
        return this.userService.update(userId, updateUserInput);
    }

    @UseGuards(AuthGuard())
    @Get('family/:familyId')
    @ApiParam({ name: 'familyId', type: String })
    @ApiResponse({
        status: 200,
        description: 'retrieve user families',
        type: [GetUserProfileByFamilyDto]
    })
    @UseInterceptors(new ZodInterceptor(z.array(GetUserProfileByFamilySchema)))
    async getFamilyUsers(@Param('familyId') familyId: string): Promise<GetUserProfileByFamilyDto[]> {
        return this.userService.getFamilyUsers(familyId);
    }

    @UseGuards(AuthGuard())
    @Get('/profile/:userId/family/:familyId')
    @ApiParam({ name: 'userId', type: String })
    @ApiParam({ name: 'familyId', type: String })
    @ApiResponse({
        status: 200,
        description: 'retrieve family profile',
        type: GetUserProfileByFamilyDto
    })
    @UseInterceptors(new ZodInterceptor(GetUserProfileByFamilySchema))
    async getProfileByFamily(@Param('userId') userId: string, @Param('familyId') familyId: string): Promise<GetUserProfileByFamilyDto> {
        return this.userService.getProfileByFamilyId(userId, familyId);
    }
}
