import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

@Injectable()
export class ZodPipe<T> implements PipeTransform {
    constructor(private readonly schema: ZodType<T, any, any>) { }

    transform(value: any, metadata: ArgumentMetadata): T {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                const prettyErrors = error.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }));
                throw new BadRequestException(prettyErrors);
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
