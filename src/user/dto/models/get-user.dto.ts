import { ApiProperty } from '@nestjs/swagger';
import { UserName } from 'user/user.model';
import { z } from 'zod';

export const userNameSchema = z.object({
    value: z.string().min(1, 'Username cannot be empty'),
    familyId: z.any()
});

export const GetUserSchema = z.object({
    id: z.string(),
    userName: z.array(userNameSchema).optional(),
    email: z.string().email('Please enter a correct email'),
    firstName: z.string().min(1, 'First name cannot be empty'),
    lastName: z.string().min(1, 'Last name cannot be empty'),
    phoneNumber: z.string().optional(),
    birthdate: z.date().optional(),
    age: z.number().min(0, 'Age cannot be negative').optional(),
    serialNumber: z.string().min(1, 'serial number cannot be empty'),
});

export class GetUserModelDto {
    @ApiProperty({ description: 'User id' })
    id?: string;

    @ApiProperty({ description: 'User Name By Family', type: [UserName] })
    userName?: UserName[];

    @ApiProperty({ description: 'User First Name' })
    firstName!: string;

    @ApiProperty({ description: 'User Last Name' })
    lastName!: string;

    @ApiProperty({ description: 'User Phone Number', required: false })
    phoneNumber?: string;

    @ApiProperty({ description: 'User Birthdate', required: false, type: Date })
    birthdate?: Date;

    @ApiProperty({ description: 'User Age', required: false, type: Number })
    age?: number;

    @ApiProperty({ description: 'User Email' })
    email!: string;

    @ApiProperty({ description: 'User Serial Number' })
    serialNumber!: string;
}