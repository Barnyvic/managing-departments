import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as session from "express-session";
import { ValidationPipe } from "@nestjs/common";
import { GraphQLErrorFilter } from "./common/filters/graphql-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");
  const isProduction = process.env.NODE_ENV === "production";

  // Enable CORS with specific options
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Accept, Authorization",
  });

  // Session middleware (needed for some features)
  app.use(
    session({
      secret: configService.get("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      },
    })
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: isProduction,
    })
  );

  // Global error filter
  app.useGlobalFilters(new GraphQLErrorFilter());

  await app.listen(port);
  if (!isProduction) {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  }
}

bootstrap();
