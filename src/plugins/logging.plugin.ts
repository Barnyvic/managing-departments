import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";

@Injectable()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger("GraphQL");

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const start = Date.now();

    return {
      willSendResponse: async (requestContext) => {
        const { operation, errors } = requestContext;
        const operationName = operation?.name?.value || "anonymous";

        if (errors?.length) {
          this.logger.error(`Operation ${operationName} failed:`, errors);
        } else {
          const duration = Date.now() - start;
          this.logger.log(
            `Operation ${operationName} completed in ${duration}ms`
          );
        }
      },

      didEncounterErrors: async (requestContext) => {
        const { errors, operation } = requestContext;
        const operationName = operation?.name?.value || "anonymous";

        errors?.forEach((error) => {
          this.logger.error(
            `GraphQL Error in ${operationName}: ${error.message}`,
            error.stack
          );
        });
      },
    };
  }
}
