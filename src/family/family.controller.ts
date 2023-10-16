import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ZodInterceptor } from 'interceptors/zod.interceptor';
import { GetUser } from 'decorators/user.decorators';
import { User } from 'user/user.model';
import { ZodPipe } from 'pipes/zod.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Family } from 'family/family.model';
import { GetFamilyModelDto, GetFamilySchema } from 'family/dto/models/get-family.dto';
import { CreateFamilyInputDto, CreateFamilyInputSchema } from 'family/dto/inputs/create-family.dto';
import { UpdateFamilyInputDto, UpdateFamilyInputSchema } from 'family/dto/inputs/update-family.dto';
import { FamilyService } from 'family/family.service';
import { z } from 'zod';
import { SuccesResponseType } from 'common-schemas/success.dto';

@Controller('family')
@ApiTags('family')
export class FamilyController {
    constructor(private familyService: FamilyService) { }

    @UseGuards(AuthGuard())
    @Get(':familyId')
    @ApiParam({ name: 'familyId', type: String })
    @ApiResponse({
        status: 200,
        description: 'get family by id',
        type: GetFamilyModelDto
    })
    @UseInterceptors(new ZodInterceptor(GetFamilySchema))
    getFamily(@Param('familyId') familyId: string): Promise<Family | null> {
        return this.familyService.getById(familyId);
    }

    @UseGuards(AuthGuard())
    @Post('/create')
    @ApiBody({ type: CreateFamilyInputDto, description: 'create a family input' })
    @ApiResponse({
        status: 200,
        description: 'create a family',
        type: GetFamilyModelDto
    })
    @UseInterceptors(new ZodInterceptor(GetFamilySchema))
    createFamily(@GetUser() user: User, @Body(new ZodPipe(CreateFamilyInputSchema)) createFamilyInput: CreateFamilyInputDto): Promise<Family> {
        return this.familyService.create(user, createFamilyInput);
    }

    @UseGuards(AuthGuard())
    @Patch('/update/:familyId')
    @ApiBody({ type: UpdateFamilyInputDto, description: 'update a family input' })
    @ApiResponse({
        status: 200,
        description: 'update a family',
        type: GetFamilyModelDto
    })
    @UseInterceptors(new ZodInterceptor(GetFamilySchema))
    updateFamily(@Param('familyId') familyId: string, @Body(new ZodPipe(UpdateFamilyInputSchema)) updateFamilyInput: UpdateFamilyInputDto): Promise<Family | null> {
        return this.familyService.update(familyId, updateFamilyInput);
    }

    @UseGuards(AuthGuard())
    @Delete('/delete/:familyId')
    @ApiParam({ name: 'familyId', type: String })
    @ApiResponse({
        status: 200,
        description: 'delete a family',
        type: SuccesResponseType
    })
    deleteFamily(@Param('familyId') familyId: string): Promise<{ success: Boolean }> {
        return this.familyService.delete(familyId);
    }

    @UseGuards(AuthGuard())
    @Get('/user/families')
    @ApiResponse({
        status: 200,
        description: 'retrieve user families',
        type: [GetFamilyModelDto]
    })
    @UseInterceptors(new ZodInterceptor(z.array(GetFamilySchema)))
    async getUserFamilies(@GetUser() user: User): Promise<GetFamilyModelDto[]> {
        return this.familyService.getUserFamilies(user);
    }

    @UseGuards(AuthGuard())
    @Delete(':familyId/user/:userId')
    @ApiParam({ name: 'familyId', type: String, description: 'ID of the family' })
    @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
    @ApiResponse({
        status: 200,
        description: 'Remove a user from a family',
        type: [GetFamilyModelDto]
    })
    @UseInterceptors(new ZodInterceptor(z.array(GetFamilySchema)))
    async removeUserFromFamily(@Param('familyId') familyId: string, @Param('userId') userId: string): Promise<GetFamilyModelDto[]> {
        return this.familyService.removeUserFromFamily(userId, familyId);
    }

    @UseGuards(AuthGuard())
    @Post('/request/:familyId/user/:userId')
    @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
    @ApiParam({ name: 'familyId', type: String, description: 'ID of the family' })
    @ApiResponse({
        status: 200,
        description: 'create a request to invite a user to the family',
        type: [SuccesResponseType]
    })
    async createFamilyRequest(@Param('familyId') familyId: string, @Param('userId') userId: string): Promise<SuccesResponseType> {
        return this.familyService.createFamilyRequest(userId, familyId);
    }
}
