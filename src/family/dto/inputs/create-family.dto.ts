import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateFamilyInputSchema = z.object({
    name: z.string().min(1, 'Family name cannot be empty'),
});

export class CreateFamilyInputDto {
    @ApiProperty({ description: 'Family Name' })
    name!: string;
}