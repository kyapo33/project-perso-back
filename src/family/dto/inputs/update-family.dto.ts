import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateFamilyInputSchema = z.object({
    name: z.string().min(1, 'Family name cannot be empty').optional(),
});

export class UpdateFamilyInputDto {
    @ApiProperty({ description: 'Family Name', required: false })
    name?: string;
}