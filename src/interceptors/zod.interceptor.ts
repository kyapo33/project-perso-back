import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { z, ZodError, ZodType } from 'zod';

@Injectable()
export class ZodInterceptor<T> implements NestInterceptor {
    constructor(private schema: ZodType<T, any, any>) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<T> | Promise<Observable<T>> {
        return next.handle().pipe(
            map(data => {
                try {
                    return this.schema.parse(data);
                } catch (error) {
                    if (error instanceof ZodError) {
                        throw new BadRequestException(error.errors);
                    }
                    throw error;
                }
            }),
            catchError((err) => {
                if (err instanceof ZodError) {
                    throw new BadRequestException(err.errors);
                }
                return throwError(err);
            })
        );
    }
}
