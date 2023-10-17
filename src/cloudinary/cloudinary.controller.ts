import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Schema } from 'mongoose';
import { CloudinaryUploadResponse } from 'cloudinary/dto/models/upload-response.dto';

@Controller('files')
@ApiTags('files')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('/upload')
    @ApiBody({ description: 'File to upload', required: true, type: Buffer })
    @ApiResponse({
        status: 200,
        description: 'uploaded image',
        type: CloudinaryUploadResponse
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return this.cloudinaryService.uploadImage(file);
    }
}