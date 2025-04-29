import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as session from "express-session";
import { ValidationPipe } from "@nestjs/common";
import { GraphQLErrorInterceptor } from "./common/interceptors/graphql-error.interceptor";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3000;
  const isProduction = process.env.NODE_ENV === "production";

  app.enableCors({
    origin: configService.get("CORS_ORIGIN") || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get("SESSION_SECRET") || "your-secret-key",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new GraphQLErrorInterceptor());

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  await app.listen(port);
  if (!isProduction) {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  }
}

bootstrap();
