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
  providers: [LoggingPlugin],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("graphql");
  }
}
