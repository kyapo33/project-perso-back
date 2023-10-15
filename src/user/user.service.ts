import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import { User, UserModel } from 'user/user.model';
import { AuthService } from 'auth/auth.service';
import { UpdateUserInputDto } from 'user/dto/inputs/update-user.dto';
import { Family } from 'family/family.model';
import { encrypt } from 'utils/crypt';
import { GetUserModelDto } from 'user/dto/models/get-user.dto';
import { GetUserProfileByFamilyDto } from 'user/dto/models/get-user-profile-by-family';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: UserModel,
        @InjectModel('Family')
        private readonly familyModel: Model<Family>,
        private readonly authService: AuthService,
    ) { }

    async getProfileByFamilyId(userId: string, familyId: string): Promise<GetUserProfileByFamilyDto> {
        return await this.userModel.findWithFamilyId(userId, familyId);
    }

    async update(userId: string, input: UpdateUserInputDto): Promise<GetUserModelDto | null> {
        const user = await this.userModel.findById(userId).exec() as User;
        const { email, password, birthdate, phoneNumber, userName } = input;

        // Check if new email is taken by another user
        if (email) {
            const emailExists = await this.authService.doesEmailExist(email);
            if (emailExists && email !== user.email) {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }
        }

        // Update password if provided, otherwise retain the old password
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : user.password;

        const age = birthdate ? await this.authService.calculateAge(new Date(birthdate)) : user.age;

        const cryptPhoneNumber = phoneNumber ? encrypt(phoneNumber) : user.phoneNumber

        return await this.userModel.findByIdAndUpdate(user.id, {
            ...input,
            password: hashedPassword,
            age,
            phoneNumber: cryptPhoneNumber,
            $addToSet: { userName: userName }
        }, { new: true });
    }

    async getFamilyUsers(familyId: string): Promise<GetUserProfileByFamilyDto[]> {
        return await this.userModel.findMultipleWithFamilyId(familyId);
    }
}
