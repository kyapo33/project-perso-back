import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z.string().email('Please enter a correct email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must start with an uppercase letter"
    )
    .refine(
      (password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password),
      'Password must contain at least one special character (!@#$%^&*()_+{}[]:;<>,.?~\\/-)'
    )
});

export class LoginInputDto {
  @ApiProperty({ description: 'User Email' })
  email!: string;

  @ApiProperty({ description: 'User Password' })
  password!: string;
}
