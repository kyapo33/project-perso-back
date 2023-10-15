// signup.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const AuthModelSchema = z.object({
    token: z.string().min(1, 'token cannot be empty'),
});

export class AuthModel {
    @ApiProperty()
    token!: string;
}

