import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { DepartmentsModule } from "./departments/departments.module";
import configuration from "./config/configuration";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { LoggingPlugin } from "./plugins/logging.plugin";
import { join } from "path";
import { dataSourceOptions } from "./config/data-source";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLExceptionFilter } from "./common/filters/graphql-exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
      introspection: true,
      path: "/graphql",
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        // If the error already has extensions, return it as is
        if (error.extensions) {
          return error;
        }

        // For any other error, return a clean error format
        return {
          message: error.message,
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500,
          },
          locations: error.locations,
          path: error.path,
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AuthModule,
    DepartmentsModule,
  ],
  providers: [
    LoggingPlugin,
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("graphql");
  }
}
