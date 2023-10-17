import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { readFileSync } from 'fs';

@Controller('swagger-json')
export class SwaggerController {
    @Get()
    @ApiExcludeEndpoint()
    getSwaggerJson(@Res() res: Response) {
        const json = readFileSync('./swagger.json', 'utf8');
        res.header('Content-Type', 'application/json');
        res.send(json);
    }
}