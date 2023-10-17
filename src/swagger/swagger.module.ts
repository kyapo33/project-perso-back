import { Module } from '@nestjs/common';
import { SwaggerController } from 'swagger/swagger.controller';

@Module({
    controllers: [SwaggerController],
})
export class SwaggerModule { }