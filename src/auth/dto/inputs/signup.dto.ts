import { ApiProperty } from '@nestjs/swagger';
import { customDateSchema } from 'common-schemas/date.schema';
import { z } from 'zod';

export const SignUpInputSchema = z.object({
  userName: z.string().min(1, 'UserName cannot be empty').optional(),

  firstName: z.string().min(1, 'First name cannot be empty'),

  lastName: z.string().min(1, 'Last name cannot be empty'),

  phoneNumber: z.string()
    .refine(
      (phoneNumber) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber),
      "Invalid phone number format"
    ).optional(),

  birthdate: customDateSchema.optional(),

  email: z.string().email('Please enter a correct email'),

  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number"
    )
    .refine(
      (password) => /^[A-Z]/.test(password),
      "Password must start with an uppercase letter"
    ),

  mobileToken: z.string()
    .refine(
      (mobileToken) => /^[a-zA-Z0-9_\-]{100,200}$/.test(mobileToken),
      "Invalid token format"
    ).optional()
});

export class SignUpInputDto {
  @ApiProperty({ description: 'UserName', required: false })
  userName?: string;

  @ApiProperty({ description: 'User Email' })
  email!: string;

  @ApiProperty({ description: 'User Password' })
  password!: string;

  @ApiProperty({ description: 'User Password', required: false })
  mobileToken?: string;

  @ApiProperty({ description: 'User First Name' })
  firstName!: string;

  @ApiProperty({ description: 'User Last Name' })
  lastName!: string;

  @ApiProperty({ description: 'User Phone Number', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'User Birthdate', type: Date, required: false })
  birthdate?: Date;
}