import { ApiProperty } from "@nestjs/swagger";

export class SuccesResponseType {
    @ApiProperty({ description: 'Success' })
    success!: boolean;
    @ApiProperty({ description: 'message', required: false })
    message?: String
}