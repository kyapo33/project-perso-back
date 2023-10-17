import { ApiProperty } from '@nestjs/swagger';

export class CloudinaryUploadResponse {
    @ApiProperty({ description: 'Asset ID' })
    asset_id!: string;

    @ApiProperty({ description: 'Public ID' })
    public_id!: string;

    @ApiProperty({ description: 'Version' })
    version!: number;

    @ApiProperty({ description: 'Version ID' })
    version_id!: string;

    @ApiProperty({ description: 'Signature' })
    signature!: string;

    @ApiProperty({ description: 'Width' })
    width!: number;

    @ApiProperty({ description: 'Height' })
    height!: number;

    @ApiProperty({ description: 'Format' })
    format!: string;

    @ApiProperty({ description: 'Resource type' })
    resource_type!: string;

    @ApiProperty({ description: 'Creation date' })
    created_at!: string;

    @ApiProperty({ description: 'Tags', type: [String] })
    tags!: string[];

    @ApiProperty({ description: 'Size in bytes' })
    bytes!: number;

    @ApiProperty({ description: 'Type' })
    type!: string;

    @ApiProperty({ description: 'Etag' })
    etag!: string;

    @ApiProperty({ description: 'Placeholder' })
    placeholder!: boolean;

    @ApiProperty({ description: 'URL' })
    url!: string;

    @ApiProperty({ description: 'Secure URL' })
    secure_url!: string;

    @ApiProperty({ description: 'Folder' })
    folder!: string;

    @ApiProperty({ description: 'Original filename' })
    original_filename!: string;

    @ApiProperty({ description: 'API Key' })
    api_key!: string;
}
