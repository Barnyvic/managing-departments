import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { GqlExceptionFilter, GqlArgumentsHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    // Handle known HTTP exceptions
    if (exception instanceof HttpException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: this.getErrorCode(exception.getStatus()),
          status: exception.getStatus(),
          response: exception.getResponse(),
        },
      });
    }

    // Handle other types of errors
    return new GraphQLError(exception.message || "Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        details: exception.stack,
      },
    });
  }

  private getErrorCode(status: number): string {
    const errorCodes = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_SERVER_ERROR",
    };

    return errorCodes[status] || "INTERNAL_SERVER_ERROR";
  }
}
