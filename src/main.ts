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
  const appUrl = configService.get("APP_URL") || `http://localhost:${port}`;

  app.enableCors({
    origin: configService.get("CORS_ORIGIN") || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get("SESSION_SECRET") ,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new GraphQLErrorInterceptor());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`, appUrl],
          imgSrc: [
            `'self'`, 
            'data:', 
            'https://cdn.jsdelivr.net',
            'https://render.com'
          ],
          scriptSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'https://cdn.jsdelivr.net',
            'https://unpkg.com',
            appUrl
          ],
          styleSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'https://cdn.jsdelivr.net',
            'https://unpkg.com'
          ],
          connectSrc: [
            `'self'`,
            appUrl,
            'ws://' + new URL(appUrl).hostname,
            'wss://' + new URL(appUrl).hostname
          ],
          frameSrc: [`'self'`, appUrl],
        },
      },
    })
  );

  await app.listen(port);
  if (!isProduction) {
    console.log(`Application is running on: ${appUrl}`);
    console.log(`GraphQL Playground: ${appUrl}/graphql`);
  } else {
    console.log(`Production server running on: ${appUrl}`);
  }
}

bootstrap();