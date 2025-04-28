import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "your-secret-key", // In production, use environment variables
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
