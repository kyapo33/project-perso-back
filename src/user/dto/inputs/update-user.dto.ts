import { ApiProperty } from '@nestjs/swagger';
import { userNameSchema } from 'user/dto/models/get-user.dto';
import { UserName } from 'user/user.model';
import { z } from 'zod';

export const UpdateUserInputSchema = z.object({
    userName: z.array(userNameSchema).optional(),

    firstName: z.string().min(1, 'First name cannot be empty').optional(),

    lastName: z.string().min(1, 'Last name cannot be empty').optional(),

    phoneNumber: z.string()
        .refine(
            (phoneNumber) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber),
            "Invalid phone number format"
        ).optional(),

    birthdate: z.date().optional(),

    email: z.string().email('Please enter a correct email').optional(),

    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .refine(
            (password) => /[0-9]/.test(password),
            "Password must contain at least one number"
        )
        .refine(
            (password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password),
            'Password must contain at least one special character (!@#$%^&*()_+{}[]:;<>,.?~\\/-)'
        ).optional(),

    mobileToken: z.string()
        .refine(
            (mobileToken) => /^[a-zA-Z0-9_\-]{100,200}$/.test(mobileToken),
            "Invalid token format"
        ).optional(),

    familyIds: z.array(z.string()).optional(),
    profilePictureId: z.string().optional()
});

export class UpdateUserInputDto {
    @ApiProperty({ description: 'User Name By Family', type: [UserName], required: false })
    userName?: UserName[];

    @ApiProperty({ description: 'User First Name', required: false })
    firstName?: string;

    @ApiProperty({ description: 'User Last Name', required: false })
    lastName?: string;

    @ApiProperty({ description: 'User Phone Number', required: false })
    phoneNumber?: string;

    @ApiProperty({ description: 'User Birthdate', required: false, type: Date })
    birthdate?: Date;

    @ApiProperty({ description: 'User Email', required: false })
    email?: string;

    @ApiProperty({ description: 'User Password', required: false })
    password?: string;

    @ApiProperty({ description: 'User Mobile Token', required: false })
    mobileToken?: string;

    @ApiProperty({ description: 'User Families', required: false })
    familyIds?: string[];

    @ApiProperty({ description: 'User profile picture id', required: false })
    profilePictureId?: string;
}