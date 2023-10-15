import { ApiProperty } from '@nestjs/swagger';
import { Schema, Document } from 'mongoose';

export class Family extends Document {
    @ApiProperty({ description: 'Family Name' })
    name!: string;

    @ApiProperty({ description: 'Family Serial Number' })
    serialNumber!: string;
}

export const FamilySchema = new Schema({
    name: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
});