import { Catch, ArgumentsHost } from "@nestjs/common";
import { GqlExceptionFilter, GqlArgumentsHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    if (exception instanceof GraphQLError) {
      return exception;
    }

    if (exception.extensions) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: exception.extensions.code,
          statusCode: exception.extensions.status,
        },
      });
    }

    if (exception.statusCode) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: exception.error || "INTERNAL_SERVER_ERROR",
          statusCode: exception.statusCode,
        },
      });
    }

    return new GraphQLError(exception.message || "Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    });
  }
}
