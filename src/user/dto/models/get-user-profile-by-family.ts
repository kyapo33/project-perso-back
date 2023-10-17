import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const GetUserProfileByFamilySchema = z.object({
    id: z.string(),
    userName: z.string().min(1, 'userName cannot be empty').optional(),
    email: z.string().email('Please enter a correct email'),
    firstName: z.string().min(1, 'First name cannot be empty'),
    lastName: z.string().min(1, 'Last name cannot be empty'),
    phoneNumber: z.string().optional(),
    birthdate: z.date().optional(),
    age: z.number().min(0, 'Age cannot be negative').optional(),
    serialNumber: z.string().min(1, 'serial number cannot be empty'),
    profilePictureUrl: z.string().optional()
});

export class GetUserProfileByFamilyDto {
    @ApiProperty({ description: 'User id' })
    id?: string;

    @ApiProperty({ description: 'User Name By Family' })
    userName?: string;

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

    @ApiProperty({ description: 'User profile picture url', required: false })
    profilePictureUrl?: string;
}