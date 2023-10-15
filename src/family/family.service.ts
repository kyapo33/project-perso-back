import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'user/user.model';
import { Family } from 'family/family.model';
import { CreateFamilyInputDto } from 'family/dto/inputs/create-family.dto';
import { UpdateFamilyInputDto } from 'family/dto/inputs/update-family.dto';
import { encrypt } from '../utils/crypt';
import { GetFamilyModelDto } from 'family/dto/models/get-family.dto';
import { SuccesResponseType } from 'common-schemas/success.dto';
import { NotificationModel, NotificationStatus, NotificationType } from 'notification/notification.model';

@Injectable()
export class FamilyService {
    constructor(
        @InjectModel('Family')
        private readonly familyModel: Model<Family>,
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @InjectModel('Notification')
        private readonly notificationModel: Model<NotificationModel>,
    ) { }

    async generateSerialNumber(): Promise<string> {
        const totalFamilies = await this.familyModel.countDocuments();
        const newSerial = `FAM-${(totalFamilies + 1).toString().padStart(4, '0')}`;
        return newSerial;
    }

    async getById(id: string): Promise<Family | null> {
        return await this.familyModel.findById(id).exec();
    }

    async create(user: User, createFamilyInputDto: CreateFamilyInputDto): Promise<Family> {
        const serialNumber = await this.generateSerialNumber();
        const cryptSerialNumber = encrypt(serialNumber)
        const newFamily = new this.familyModel({ ...createFamilyInputDto, serialNumber: cryptSerialNumber });
        const savedFamily = await newFamily.save();

        // Update the user's familyIds
        await this.userModel.findByIdAndUpdate(user.id, {
            $push: { familyIds: savedFamily.id }
        });

        return savedFamily;
    }

    async update(familyId: string, input: UpdateFamilyInputDto): Promise<Family | null> {
        return await this.familyModel.findByIdAndUpdate(familyId, {
            ...input
        }, { new: true });
    }

    async delete(familyId: string): Promise<{ success: boolean }> {
        const result = await this.familyModel.findByIdAndRemove(familyId).exec();

        if (!result) {
            throw new NotFoundException(`Family with ID ${familyId} not found`);
        }

        await this.userModel.updateMany(
            { familyIds: familyId },
            { $pull: { familyIds: familyId } }
        ).exec();

        return { success: true };
    }

    async getUserFamilies(user: User): Promise<GetFamilyModelDto[]> {
        if (!user.id) {
            throw new NotFoundException(`User with ID ${user.id} not found`);
        }
        return this.familyModel.find({ _id: { $in: user.familyIds } }).exec();
    }

    async removeUserFromFamily(userId: string, familyId: string): Promise<GetFamilyModelDto[]> {
        await this.userModel.updateOne({ _id: userId }, { $pull: { familyIds: familyId } }).exec();
        const updatedUser = await this.userModel.findById(userId).exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return this.familyModel.find({ _id: { $in: updatedUser.familyIds } }).exec();
    }

    async createFamilyRequest(user: User, familySerialNumber: string): Promise<SuccesResponseType> {
        const family = await this.familyModel.findOne({ serialNumber: familySerialNumber });

        if (!family) {
            throw new HttpException('Family not found', HttpStatus.NOT_FOUND);
        }

        // Check if user is already a member
        if (user && user.familyIds?.includes(family.id)) {
            throw new HttpException('User is already a member of the family', HttpStatus.BAD_REQUEST);
        }

        const newNotification = {
            type: NotificationType.FAMILY_REQUEST,
            createdBy: user.id,
            familyId: family.id,
            status: NotificationStatus.WAITING,
            read: false
        }

        await this.notificationModel.create({
            ...newNotification
        });

        return { success: true };
    }
}
