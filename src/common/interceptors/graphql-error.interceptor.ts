import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class GraphQLErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const response = error.getResponse() as any;
          const graphQLError = {
            message: response.message || error.message,
            extensions: {
              code: response.error || error.name,
              status: error.getStatus(),
              response: {
                message: response.message || error.message,
                error: response.error || error.name,
                statusCode: error.getStatus(),
              },
            },
          };
          return throwError(() => graphQLError);
        }
        return throwError(() => error);
      })
    );
  }
}
