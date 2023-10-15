import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const GetFamilySchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Family name cannot be empty'),
});

export class GetFamilyModelDto {
    @ApiProperty({ description: 'Family id' })
    id?: string;

    @ApiProperty({ description: 'Family Name' })
    name!: string;
}